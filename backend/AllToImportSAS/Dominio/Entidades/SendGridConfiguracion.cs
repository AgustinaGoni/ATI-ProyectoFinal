﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dominio.Entidades
{
    public  class SendGridConfiguracion
    {
        public string ApiKey { get; set; }
        public string SenderName { get; set; }
        public string SenderEmail { get; set; }
    }
}
