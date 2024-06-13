using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using UMS_BusinessLogic.Repositories;
using UMS_DataAccess.Dto;
using UMS_DataAccess.Models;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Authorization;
using UMS_BusinessLogic.Services.Interfaces;

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

        /// <summary>
        /// Retrieves a list of users based on the provided ID.
        /// </summary>
        /// <param name="id">The ID used to filter the user list.</param>
        /// <returns>An IActionResult containing the list of users.</returns>
        [Authorize]
        [HttpGet("all/{id}")]
        public async Task<IActionResult> GetUsers(int id)
        {
            var user = await _userService.GetUsers(id);
            return Ok(user);
        }


        /// <summary>
        /// Creates a new user.
        /// </summary>
        /// <param name="userDto">The UserDto object containing user details.</param>
        /// <returns>An IActionResult containing the created user.</returns>
        
        [Authorize]
        [HttpPost]
        public async Task<IActionResult> CreateUser(UserDto userDto)
        {
            if (userDto != null)
            {
                bool usernameExists = await _userService.UserExists(userDto.UserName, userDto.Email, 0);

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


        /// <summary>
        /// Updates an existing user.
        /// </summary>
        /// <param name="id">The ID of the user to update.</param>
        /// <param name="userDto">The UserDto object containing updated user details.</param>
        /// <returns>An IActionResult containing the updated user.</returns>
        
        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(int id, UserDto userDto)
        {
            bool usernameExists = await _userService.UserExists(userDto.UserName, userDto.Email, id);

            if (usernameExists)
            {
                return Conflict("Username already exists");
            }

            if (userDto == null || id == 0)
                return BadRequest();

            var existingUser = await _userService.GetUserById(id);
            if (existingUser == null)
                return NotFound();

            _mapper.Map(userDto, existingUser);
            var updatedUser = await _userService.UpdateUser(id, existingUser);
            var response = _mapper.Map<UserDto>(updatedUser);
            return Ok(response);
        }


        /// <summary>
        /// Deletes one or more users based on their IDs.
        /// </summary>
        /// <param name="id">An array of user IDs to delete.</param>
        /// <returns>An IActionResult indicating the result of the delete operation.</returns>
       
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
