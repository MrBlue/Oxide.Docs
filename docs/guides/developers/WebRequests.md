---
title: Web Requests
after: Timers
---
# Web Requests

Make a web request to a URI (Uniform Resource Identifier) using the HTTP GET, POST, or PUT methods.

Web requests create a raw connection to a web page as done in a web browser. The request will return true if the web request was sent, false if not.

The callback is called with 2 parameters - an integer HTTP response code and a string response.
## GET web request

The HTTP GET method is used to retrieve a resource, usually represented as XML or JSON. HTTP status code 200 (OK) is expected in response to a successful GET request.
```csharp
webrequest.Enqueue("http://www.google.com/search?q=umod", null, (code, response) =>
{
    if (code != 200 || response == null)
    {
        Puts($"Couldn't get an answer from Google!");
        return;
    }
    Puts($"Google answered: {response}");
}, this, RequestMethod.GET);
```
## Advanced GET request

The following example demonstrates how to specify custom request timeout and/or additional headers.
```csharp
[Command("get")]
private void GetRequest(IPlayer player, string command, string[] args)
{
    // Set a custom timeout (in milliseconds)
    float timeout = 200f;

    // Set some custom request headers (eg. for HTTP Basic Auth)
    Dictionary<string, string> headers = new Dictionary<string, string> { { "header", "value" } };

    webrequest.Enqueue("http://www.google.com/search?q=umod", null, (code, response) =>
        GetCallback(code, response, player), this, RequestMethod.GET, headers, timeout);
}

private void GetCallback(int code, string response, IPlayer player)
{
    if (response == null || code != 200)
    {
        Puts($"Error: {code} - Couldn't get an answer from Google for {player.Name}");
        return;
    }

    Puts($"Google answered for {player.Name}: {response}");
}
```
## POST web request

The HTTP POST method is generally used to create new resources. HTTP status code 200 (OK) OR HTTP status code 201 (Created), and an accompanying redirect (to the newly created resource) are expected in response to a successful POST request.
```csharp
webrequest.Enqueue("http://www.google.com/search?q=umod", "param1=value1", (code, response) =>
{
    if (code != 200 || response == null)
    {
        Puts($"Couldn't get an answer from Google!");
        return;
    }
    Puts($"Google answered: {response}");
}, this, RequestMethod.POST);
```
## PUT web request

The HTTP PUT is generally used to update existing resources. The request body of a PUT request generally contains an updated representation of the original resource. HTTP status code 200 (OK) OR HTTP status code 204 (No Content) are expected in response to a successful PUT request.

webrequest.Enqueue("http://www.google.com/search?q=umod", null, (code, response) =>
{
    if (code != 200 || response == null)
    {
        Puts($"Couldn't get an answer from Google!");
        return;
    }
    Puts($"Google answered: {response}");
}, this, RequestMethod.PUT);

## POST and PUT body

Typically an updated resource is represented in a POST/PUT request body as a query string.
```csharp
Dictionary<string,string> parameters = new Dictionary<string,string>();

parameters.Add("param1", "value1");
parameters.Add("param2", "value2");

string[] body = string.Join("&", parameters.Cast<string>().Select(key => string.Format("{0}={1}", key, source[key]));
webrequest.Enqueue("http://www.google.com/search?q=umod", body, (code, response) =>
{
    if (code != 200 || response == null)
    {
        Puts($"Couldn't get an answer from Google!");
        return;
    }
    Puts($"Google answered: {response}");
}, this, RequestMethod.POST);
```
## Using a method callback

The following example demonstrates how to refactor delegate behavior by encapsulating it in a separate method, rather than solely using an anonymous function.
```csharp
[Command("get")]
private void GetRequest(IPlayer player, string command, string[] args)
{
    webrequest.EnqueueGet("http://www.google.com/search?q=umod", (code, response) => GetCallback(code, response, player), this);
}

private void GetCallback(int code, string response, IPlayer player)
{
    if (response == null || code != 200)
    {
        Puts($"Error: {code} - Couldn't get an answer from Google for {player.Name}");
        return;
    }

    Puts($"Google answered for {player.Name}: {response}");
}
```