using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Data;
using UMS_BusinessLogic.Services.Interfaces;
using UMS_DataAccess.Dto;
using UMS_DataAccess.Models;

namespace UMS_API.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : Controller
    {
        private readonly IUserService _userService;
        private readonly IAuthService _authService;
        private readonly IRoleService _roleService;
        private readonly ILogger<UserController> _logger;
        private readonly IJwtService _jwtService;

        public AuthController(IUserService userService, ILogger<UserController> logger, IJwtService jwtService, IAuthService authService,IRoleService roleService)
        {
            _userService = userService;
            _logger = logger;
            _jwtService = jwtService;
            _authService = authService;
            _roleService=roleService;
        }


        [HttpPost]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(ApiResponseDto<string>))]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<ApiResponseDto<string>>> LoginUser([FromBody] LoginDto loginDto)
        {
            ApiResponseDto<string> response = new ApiResponseDto<string>();

            if (loginDto == null)
            {
                return BadRequest("Login data is required.");
            }

            if (!ModelState.IsValid)
            {

                List<string> errors = ModelState.Values.SelectMany(v => v.Errors)
                                              .Select(e => e.ErrorMessage)
                                              .ToList();
                return BadRequest(new { Errors = errors });
            }

            bool isAuthenticated = await _authService.Authenticate(loginDto.UserName, loginDto.Password);

            if (isAuthenticated)
            {
                User user = await _userService.GetUserByUsername(loginDto.UserName);

                if (user != null)
                {
                    AspNetRole? aspNetRole = await _roleService.GetRoleNameById(user.RoleId);
                    var token = _jwtService.GetJwtToken(loginDto.UserName, aspNetRole.Role);
                    response.success = true;
                    response.token = token;
                    response.role = aspNetRole.Role;
                    response.id = user.Id;
                    return Ok(response);
                }
            }

            response.success = false;
            return Ok(response);
        }

    }

}