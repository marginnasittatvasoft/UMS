using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using UMS_BusinessLogic.Repositories;
using UMS_DataAccess.Dto;
using UMS_DataAccess.Models;
using Microsoft.Extensions.Logging;
using UMS_BusinessLogic.Services;
using Microsoft.AspNetCore.Authorization;

namespace UMS_API.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    public class UserController : Controller
    {
        private readonly IMapper _mapper;
        private readonly IUserService _userService;
        private readonly ILogger<UserController> _logger;

        public UserController(IMapper mapper, IUserService userService, ILogger<UserController> logger)
        {
            _mapper = mapper;
            _userService = userService;
            _logger = logger;
        }


        [Authorize]
        [HttpGet("all/{id}")]
        public async Task<IActionResult> GetUsers(int id)
        {
            var user = await _userService.GetUsers(id);
            return Ok(user);
        }

        [Authorize]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetUsersById(int id)
        {
            var user = await _userService.GetUserById(id);
            return Ok(user);

        }

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> CreateUser(UserDto userDto)
        {
            if (userDto != null)
            {
                bool usernameExists = await _userService.UserExists(userDto.UserName,userDto.Email,0);

                if (usernameExists)
                {
                    return Conflict("Username already exists"); 
                }

                var user = _mapper.Map<User>(userDto);

                var addUser = await _userService.AddUser(user);

                var response = _mapper.Map<UserDto>(addUser);
                return Ok(response);
            }

            return NotFound();
        }


        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(int id, UserDto userDto)
        {
            bool usernameExists = await _userService.UserExists(userDto.UserName,userDto.Email, id);

            if (usernameExists)
            {
                return Conflict("Username already exists");
            }

            if (userDto == null && id == 0)
                return BadRequest();

            var existingUser = await _userService.GetUserById(id);
            if (existingUser == null)
                return NotFound();

            _mapper.Map(userDto, existingUser);

            var updatedUser = await _userService.UpdateUser(id, existingUser);

            var response = _mapper.Map<UserDto>(updatedUser);
            return Ok(response);
        }

        [Authorize]
        [HttpDelete]
        public async Task<IActionResult> DeleteUser([FromBody] int[] id)
        {
            var result = await _userService.DeleteUser(id);

            if (!result)
                return NotFound();

            return NoContent();
        }
    }
    
}
