using AutoMapper;
using UMS_DataAccess.Dto;
using UMS_DataAccess.Models;

namespace EMS.API.Profiles
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<User, UserDto>();
            CreateMap<UserDto, User>();
        }
    }
}
