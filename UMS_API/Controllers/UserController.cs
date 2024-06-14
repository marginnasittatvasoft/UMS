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
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(List<UserDto>))]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetUsers(int id)
        {
            List<User> user = await _userService.GetUsers(id);
            return Ok(user);
        }



        /// <summary>
        /// Retrieves a list of Roles.
        /// </summary>
        /// <returns>An IActionResult containing the list of users.</returns>
        [HttpGet("roles")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(List<AspNetRole>))]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetAllRoles()
        {
            List<AspNetRole> roles = await _userService.GetAllRoles();
            return Ok(roles);
        }



        /// <summary>
        /// Creates a new user.
        /// </summary>
        /// <param name="userDto">The UserDto object containing user details.</param>
        /// <returns>An IActionResult containing the created user.</returns>

        [Authorize]
        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created, Type = typeof(UserDto))]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status409Conflict)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> CreateUser([FromBody] UserDto userDto)
        {
            if (userDto == null)
            {
                return BadRequest("User data is required.");
            }

            if (!ModelState.IsValid)
            {
                List<string> errors = ModelState.Values.SelectMany(v => v.Errors)
                                              .Select(e => e.ErrorMessage)
                                              .ToList();
                return BadRequest(new { Errors = errors });
            }

            bool usernameExists = await _userService.UserExists(userDto.UserName, userDto.Email, 0);

            if (usernameExists)
            {
                return Conflict("Username already exists");
            }

            User user = _mapper.Map<User>(userDto);
            User addUser = await _userService.AddUser(user);
            UserDto response = _mapper.Map<UserDto>(addUser);
            return Ok(response);
        }



        /// <summary>
        /// Updates an existing user.
        /// </summary>
        /// <param name="id">The ID of the user to update.</param>
        /// <param name="userDto">The UserDto object containing updated user details.</param>
        /// <returns>An IActionResult containing the updated user.</returns>

        [Authorize]
        [HttpPut("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(UserDto))]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status409Conflict)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> UpdateUser(int id, [FromBody] UserDto userDto)
        {
            if (userDto == null)
            {
                return BadRequest("User data is required.");
            }

            if (!ModelState.IsValid)
            {
                List<string> errors = ModelState.Values.SelectMany(v => v.Errors)
                                              .Select(e => e.ErrorMessage)
                                              .ToList();
                return BadRequest(new { Errors = errors });
            }

            if (id == 0)
            {
                return BadRequest("Invalid user ID.");
            }

            bool usernameExists = await _userService.UserExists(userDto.UserName, userDto.Email, id);

            if (usernameExists)
            {
                return Conflict("Username already exists.");
            }

            User existingUser = await _userService.GetUserById(id);
            if (existingUser == null)
            {
                return NotFound("User not found.");
            }

            _mapper.Map(userDto, existingUser);
            User updatedUser = await _userService.UpdateUser(id, existingUser);
            UserDto response = _mapper.Map<UserDto>(updatedUser);
            return Ok(response);
        }



        /// <summary>
        /// Deletes one or more users based on their IDs.
        /// </summary>
        /// <param name="id">An array of user IDs to delete.</param>
        /// <returns>An IActionResult indicating the result of the delete operation.</returns>

        [Authorize]
        [HttpDelete]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> DeleteUser([FromBody] int[] id)
        {
            bool result = await _userService.DeleteUser(id);

            if (!result)
                return NotFound();

            return NoContent();
        }
    }
}
