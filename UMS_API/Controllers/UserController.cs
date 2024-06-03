using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using UMS_BusinessLogic.Interfaces;
using UMS_DataAccess.Dto;
using UMS_DataAccess.Models;

namespace UMS_API.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    public class UserController : Controller
    {
        private readonly IMapper _mapper;
        private readonly IUserInterface _userInterface;

        public UserController(IMapper mapper, IUserInterface userInterface)
        {
            _mapper = mapper;
            _userInterface = userInterface;
        }


        [HttpGet]
        public async Task<IActionResult> GetUsers()
        {
            var user = await _userInterface.GetUsers();
            return Ok(user);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetUsersById(int id)
        {
            var user = await _userInterface.GetUserById(id);
            return Ok(user);

        }


        [HttpPost]
        public async Task<IActionResult> CreateUser(UserDto userDto)
        {
            if (userDto != null)
            {
                var user = _mapper.Map<User>(userDto);

                var addUser = await _userInterface.AddUser(user);

                var response = _mapper.Map<UserDto>(addUser);
                return Ok(response);
            }

            return NotFound();
        }


        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(int id, UserDto userDto)
        {
            if (userDto == null && id == 0)
                return BadRequest();

            var existingUser = await _userInterface.GetUserById(id);
            if (existingUser == null)
                return NotFound();

            _mapper.Map(userDto, existingUser);

            var updatedUser = await _userInterface.UpdateUser(id, existingUser);

            var response = _mapper.Map<UserDto>(updatedUser);
            return Ok(response);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var result = await _userInterface.DeleteUser(id);

            if (!result)
                return NotFound();

            return NoContent();
        }
    }
    
}
