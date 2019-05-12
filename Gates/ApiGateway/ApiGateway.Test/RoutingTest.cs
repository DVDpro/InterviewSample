using Microsoft.AspNetCore.Mvc.Testing;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Xunit;

namespace ApiGateway.Test
{
    public class RoutingTest : IClassFixture<WebApplicationFactory<Startup>>
    {
        private readonly WebApplicationFactory<Startup> _factory;

        public RoutingTest(WebApplicationFactory<Startup> factory)
        {
            _factory = factory;
        }

        [Theory]
        [InlineData("/api/data/values")]
        public async Task Get_Data_Anonymous(string url)
        {
            var client = _factory.CreateClient();
            var response = await client.GetAsync(url);
            Assert.Equal(System.Net.HttpStatusCode.OK, response.StatusCode);
        }

        [Fact]
        public async Task Get_Data_Unauthorized()
        {
            var client = _factory.CreateClient();
            var response = await client.GetAsync("/api/data/privatevalues");
            Assert.Equal(System.Net.HttpStatusCode.Unauthorized, response.StatusCode);
        }

        //[Fact]
        //public async Task Get_Data_Authorized()
        //{
        //    var client = await _factory.CreateAuthClient();
        //    var response = await client.GetAsync("/api/data/v3.0/Values/GetData");
        //    Assert.Equal(System.Net.HttpStatusCode.OK, response.StatusCode);
        //}
    }
}
