# Native PowerShell Web Server for E:\Website listening on Port 8080 and Port 8000
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:8080/")
$listener.Prefixes.Add("http://localhost:8000/")

# for google authentication
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client('429904534455-n7nkh8qe87b2piecusjfcig3hu8s0l2j.apps.googleusercontent.com'); // Dán Client ID vào đây


try {
    $listener.Start()
    Write-Host "==========================================" -ForegroundColor Green
    Write-Host "  Tagki Local Server Running at:     " -ForegroundColor Cyan
    Write-Host "  http://localhost:8080/                  " -ForegroundColor Yellow
    Write-Host "  http://localhost:8000/                  " -ForegroundColor Yellow
    Write-Host "==========================================" -ForegroundColor Green
} catch {
    Write-Host "Error starting server: $_" -ForegroundColor Red
    exit 1
}

$root = "E:\Website"

try {
    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response
        
        $path = $request.Url.LocalPath
        if ($path -eq "/" -or [string]::IsNullOrWhiteSpace($path)) {
            $path = "/index.html"
        }
        
        $localPath = Join-Path $root ($path.TrimStart('/').Replace('/', '\'))

        if (Test-Path $localPath -PathType Leaf) {
            try {
                $bytes = [System.IO.File]::ReadAllBytes($localPath)
                $ext = [System.IO.Path]::GetExtension($localPath).ToLower()
                
                switch ($ext) {
                    ".html" { $response.ContentType = "text/html; charset=utf-8" }
                    ".css"  { $response.ContentType = "text/css; charset=utf-8" }
                    ".js"   { $response.ContentType = "application/javascript; charset=utf-8" }
                    ".json" { $response.ContentType = "application/json; charset=utf-8" }
                    ".png"  { $response.ContentType = "image/png" }
                    ".jpg"  { $response.ContentType = "image/jpeg" }
                    ".jpeg" { $response.ContentType = "image/jpeg" }
                    ".webp" { $response.ContentType = "image/webp" }
                    ".svg"  { $response.ContentType = "image/svg+xml" }
                    ".ico"  { $response.ContentType = "image/x-icon" }
                    default { $response.ContentType = "text/plain; charset=utf-8" }
                }
                
                $response.ContentLength64 = $bytes.Length
                $response.OutputStream.Write($bytes, 0, $bytes.Length)
            } catch {
                $response.StatusCode = 500
            }
        } else {
            $response.StatusCode = 404
            $msg = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found")
            $response.ContentLength64 = $msg.Length
            $response.OutputStream.Write($msg, 0, $msg.Length)
        }
        
        $response.OutputStream.Close()
    }
} finally {
    if ($listener.IsListening) {
        $listener.Stop()
    }
}

app.post('/api/auth/google', async (req, res) => {
  const { token } = req.body;
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: '429904534455-n7nkh8qe87b2piecusjfcig3hu8s0l2j.apps.googleusercontent.com'
    });
    const payload = ticket.getPayload();
    const email = payload['email'];
    const name = payload['name'];
    const picture = payload['picture'];

    // Kiểm tra xem user đã tồn tại trong database Supabase chưa
    let user = await db.findUserByEmail(email); // Hàm kiểm tra DB
    if (!user) {
      // Nếu chưa có, tiến hành đăng ký tài khoản tự động
      user = await db.createUser({
        email: email,
        fullName: name,
        avatar: picture,
        role: 'customer'
      });
    }
    res.json({ success: true, user });
  } catch (error) {
    res.status(401).json({ success: false, message: "Token verify failed: " + error.message });
  }
});