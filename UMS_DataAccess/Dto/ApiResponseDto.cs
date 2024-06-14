using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace UMS_DataAccess.Dto
{
    public class ApiResponseDto<T>
    {
        public bool success { get; set; }
        public T? token { get; set; }
        public string? role { get; set; }
        public int? id { get; set; }
    }
}
