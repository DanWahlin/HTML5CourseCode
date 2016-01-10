<%@ WebHandler Language="C#" Class="TickerHandler" %>

using System;
using System.Web;
using System.Xml.Linq;
using System.Linq;
using System.Web.Script.Serialization;
using System.Collections.Generic;

public class TickerHandler : IHttpHandler {

    List<Ticker> _Tickers;
    
    public void ProcessRequest (HttpContext context) {
        _Tickers = CreateTickers();
        var symbols = GetTickers(context.Request["symbol"]);
        context.Response.ContentType = "application/json";
        var json = new JavaScriptSerializer().Serialize(symbols);        
        context.Response.Write(json);
    }

    private List<Ticker> GetTickers(string symbol)
    {

        return (from s in _Tickers
                where s.Symbol.ToLower().Contains(symbol.ToLower())
                select s).ToList();

    }

    private List<Ticker> CreateTickers()
    {
        return new List<Ticker>
        {
            new Ticker { Symbol = "AAPL" },
            new Ticker { Symbol = "A" },
            new Ticker { Symbol = "AB" },
            new Ticker { Symbol = "CSCO" },
            new Ticker { Symbol = "GOOG" },
            new Ticker { Symbol = "INTC" },
            new Ticker { Symbol = "IBM" },
            new Ticker { Symbol = "MSFT" }
        };
    }
 
    public bool IsReusable {
        get {
            return false;
        }
    }

}

public class Ticker
{
    public string Symbol { get; set; }
}
