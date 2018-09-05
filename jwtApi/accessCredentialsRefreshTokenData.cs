using System.Security.Cryptography;
using Microsoft.IdentityModel.Tokens;

namespace jwtApi
{
    public class AccessCredentials
    {
        public string UserID { get; set; }
        public string AccessKey { get; set; }
        public string RefreshToken { get; set; }
        public string GrantType { get; set; }
    }

    public class RefreshTokenData
    {
        public string RefreshToken { get; set; }
        public string UserID { get; set; }
    }
}    
    