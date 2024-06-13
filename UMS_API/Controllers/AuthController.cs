using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Data;
using UMS_BusinessLogic.Services.Interfaces;
using UMS_DataAccess.Dto;

namespace UMS_API.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : Controller
    {
        private readonly IMapper _mapper;
        private readonly IUserService _userService;
        private readonly IAuthService _authService;
        private readonly ILogger<UserController> _logger;
        private readonly IJwtService _jwtService;

        public AuthController(IMapper mapper, IUserService userService, ILogger<UserController> logger, IJwtService jwtService, IAuthService authService)
        {
            _mapper = mapper;
            _userService = userService;
            _logger = logger;
            _jwtService = jwtService;
            _authService = authService;
        }

        [HttpPost]
        public async Task<ActionResult<ApiResponseDto<string>>> LoginUser([FromBody] LoginDto loginDto)
        {
            ApiResponseDto<string> response = new ApiResponseDto<string>();
            if (loginDto != null)
            {
                bool isAuthenticated = await _authService.Authenticate(loginDto.UserName, loginDto.Password);
                

                if (isAuthenticated)
                {
                    var userRoles = await _userService.GetUserRoles(loginDto.UserName);

                    int? role = userRoles.RoleId;
                    string roles = role switch
                    {
                        1 => "Admin",
                        2 => "User",
                        _ => "User"
                    };

                    var token = _jwtService.GetJwtToken(loginDto.UserName,roles);
                    response.success = true;
                    response.message = "Login Successfull";
                    response.token = token;
                    response.role = roles;
                    response.id = userRoles.Id;
                    return Ok(response);
                }
                else
                {
                    response.success = false;
                    return Ok(response);
                }
            }

            return BadRequest();
        }
    }

}