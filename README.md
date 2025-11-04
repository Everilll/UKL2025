<center>
  <h1>LATIHAN UKL 3-4 NOVEMBER 2025</h1>
</center>

## 1. AUTENTIKASI & OTORISASI

### Endpoint: /api/auth/login
### Method: POST
### Description: Untuk login pengguna dan menghasilkan token autentikasi.
## Request Body:
```
{
  "username" : "string",
  "password" : "string"
}
```
## Response
```
{
  "status" : "success",
  "message" : "Login berhasil",
  "token" : "string"
}
```

## code:
```
async LoginUser(username: string, password: string) {
        try {
            const findUsername = await this.prisma.user.findUnique({
                where: { username }
            })

            if (!findUsername) {
                return {
                    success: false,
                    message: 'Username tidak ditemukan',
                    data: null
                }
            }

            const IsPasswordValid = findUsername.password === password

            if (!IsPasswordValid) {
                return {
                    success: false,
                    message: 'Password salah',
                    data: null
                }
            }

            const payload = {
                id: findUsername.id,
                name: findUsername.name,
                username: findUsername.username,
                role: findUsername.role
            }

            return {
                status: 'success',
                message: 'Login berhasil',
                token: this.jwtService.sign(payload)
            }
        } catch (error) {
            return new InternalServerErrorException(error)
        }
    }
```
# Penjelasan:
### findUsername 
untuk memastikan user benar-benar memasukkan username akunnya sendiri
### IsPasswordValid
untuk cek password yang diinput user apakah sesuai dengan akun user yang sudah ada sesuai dengan username sebelumnya
### payload
variabel yang menyimpan data yang akan saya ubah menjadi token jwt

### Jika username dan password yang diinput user sesuai dengan yang ada di database, maka user dinyatakan berhasil login