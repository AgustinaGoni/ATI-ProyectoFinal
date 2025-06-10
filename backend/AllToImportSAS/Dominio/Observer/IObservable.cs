using Dominio.Entidades;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Observer
{
    //public interface IObservable
    //{
    //    public enum Evento
    //    {
    //        PagoRealizado,
    //        CompraRegistrada
    //    }

    //    Task NotificarPagoAprobado(long paymentId);
    //    Task NotificarPorMailLaCompra(Object t);

    //}

    public interface IObservable
    {
        void NotificarTodos(Compra compra);
        void Subscribir(IObserver observer);
        void Desubscribir(IObserver observer);
        //Task NotificarPagoAprobadoAsync(long paymentId);

    }
}
