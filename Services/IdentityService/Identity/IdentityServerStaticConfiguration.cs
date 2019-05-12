using IdentityServer4;
using IdentityServer4.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Identity
{
    public class IdentityServerStaticConfiguration
    {
        public static IEnumerable<IdentityResource> GetIdentityResources()
        {
            return new List<IdentityResource>
            {
                new IdentityResources.OpenId(),
                new IdentityResources.Profile(),
                new IdentityResources.Email(),
            };
        }

        private const string DataApiResourceKey = "data";

        public static IEnumerable<ApiResource> GetApiResources()
        {
            return new List<ApiResource>
            {
                new ApiResource(DataApiResourceKey, "Data.Api")
            };
        }

        public static IEnumerable<Client> GetClients()
        {
            return new List<Client>
            {
                new Client
                {
                    ClientId = "api.client.spa",
                    AllowedGrantTypes = GrantTypes.Code,
                    ClientSecrets =
                    {
                        new Secret("p@ssw0rd".Sha256()) //TODO: load client secrets from configuration (in dev: secret.json)
                    },
                    RequirePkce = true,
                    RedirectUris =           { "http://localhost", "http://localhost:4200", "https://localhost:44306" },
                    PostLogoutRedirectUris = { "http://localhost", "http://localhost:4200", "https://localhost:44306" },
                    AllowedCorsOrigins =     { "http://localhost", "http://localhost:4200", "https://localhost:44306" },
                    AllowedScopes = {
                        IdentityServerConstants.StandardScopes.OpenId,
                        IdentityServerConstants.StandardScopes.Email,
                        IdentityServerConstants.StandardScopes.Profile,
                        DataApiResourceKey
                    }
                }
            };
        }
    }

}
