<%@ WebHandler Language="C#" Class="QuoteHandler" %>

using System;
using System.Web;
using System.Xml.Linq;
using System.Web.Script.Serialization;

public class QuoteHandler : IHttpHandler {
    
    public void ProcessRequest (HttpContext context) {
        var quote = GetQuote(context.Request["symbol"]);
        context.Response.ContentType = "application/json";
        var json = new JavaScriptSerializer().Serialize(quote);        
        context.Response.Write(json);
    }

    private Quote GetQuote(string symbol)
    {

        var random = new Random();
        return new Quote
        {
            Company = symbol,
            Last = random.Next(1, 500)
        };

    }

    private string GetData(XDocument doc, string name)
    {
        return doc.Root.Element("finance").Element(name).Attribute("data").Value;
    }
 
    public bool IsReusable {
        get {
            return false;
        }
    }

}

public class Quote {
    public string Company { get; set; }
    public double Last { get; set; }   
}