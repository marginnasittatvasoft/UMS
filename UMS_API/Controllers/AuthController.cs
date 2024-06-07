using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using UMS_BusinessLogic.Services;
using UMS_DataAccess.Dto;

namespace UMS_API.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : Controller
    {
        private readonly IMapper _mapper;
        private readonly IUserService _userService;
        private readonly ILogger<UserController> _logger;
        private readonly IJwtService _jwtService;

        public AuthController(IMapper mapper, IUserService userService, ILogger<UserController> logger, IJwtService jwtService)
        {
            _mapper = mapper;
            _userService = userService;
            _logger = logger;
            _jwtService = jwtService;
        }

        [HttpPost]
        public async Task<ActionResult<ApiResponseDto<string>>> LoginUser([FromBody] LoginDto loginDto)
        {
            ApiResponseDto<string> response = new ApiResponseDto<string>();
            if (loginDto != null)
            {
                bool isAuthenticated = await _userService.Authenticate(loginDto.UserName, loginDto.Password);

                if (isAuthenticated)
                {
                    var token = _jwtService.GetJwtToken(loginDto.UserName);
                    response.success = true;
                    response.message = "Login Successfull";
                    response.token = token;
                    return Ok(response);
                }
                else
                {
                    response.success = false;
                    response.message = "Invalid credentials";
                    response.token = null;
                    return Ok(response);
                }
            }

            return BadRequest();
        }
    }

}