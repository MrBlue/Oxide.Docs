---
title: Plugin Guidelines
after: Database
---

# Plugin Guidelines

Here, we will guide you through key practices and conventions that will set you up for success in developing plugins for Rust using the Oxide Mod framework. Whether you're a seasoned developer or just starting your journey in plugin development, adhering to these guidelines can help you create clean, maintainable, and efficient plugins. This guide will cover a range of topics, from naming conventions and error handling, to versioning, documentation, and respectfulness in coding practices. So let's dive in!

## 1. Naming Conventions
### 1.1 Plugin Files, Classes, Namespaces
The filename of your plugin should be clear, concise and indicative of its functionality. It should match the name of your main class and use PascalCase (e.g., `MyFirstPlugin.cs`). The class and file name should be encapsulated in a namespace - `Oxide.Plugins` is a common choice.

For example:
```csharp
namespace Oxide.Plugins;

[Info("MyFirstPlugin", "Author Name", "1.0.0")]
public class MyFirstPlugin : RustPlugin
{
    // Your code here
}
```
### 1.2 Commands
Commands should be in lowercase and use underscores to separate words (e.g., `my_command`). The name should clearly indicate the functionality of the command.

For example:
```csharp
[ChatCommand("my_command")]
private void MyCommand(BasePlayer player, string command, string[] args)
{
    // Your code here
}
```

### 1.3 Permissions
Permissions should follow a specific format: `pluginname.permission`. The plugin name should be in lowercase and the permission should clearly represent its function.

For example:
```csharp
void Init()
{
    permission.RegisterPermission("myfirstplugin.mypermission", this);
}
```

### 1.4 Variables and Properties
In C#, different types of variables typically follow different naming conventions:

- `Local variables and method parameters` should use camelCase. The first letter is lowercase, and the first letter of each subsequent concatenated word starts with an uppercase letter.
```csharp
void MyMethod(string myParameter)
{
    int localVariable = 123;
}
```
- `Properties` should use PascalCase. This means concatenating capitalized words together.
```csharp
public class MyClass
{
    public string MyProperty { get; set; }
}
```
- `Private instance variables (often referred to as class fields)` can either use camelCase or prefix with an underscore and then use camelCase. The underscore approach is often used when there is a property with the same name.
```csharp
public class MyClass
{
    private string _myField;

    public string MyField
    {
        get { return _myField; }
        set { _myField = value; }
    }
}
```
In all cases, choose variable names that are clear and descriptive to make your code more readable.

## 2. Commenting

### 2.1 General
Aim to make your code as self-explanatory as possible. This often reduces the need for comments. However, comments are crucial when the code is complex or incorporates a logic that is not immediately apparent. Always write your comments in English.

### 2.2 Comment Types
Here are different types of comments you might use in your plugin:

- `Single line comments` start with `//` and are typically placed above the code they refer to.
```csharp
// Increment the counter
counter++;
```
- `Multi-line comments` start with `/*` and end with `*/`. These are less common in C#, but can be useful if you need to temporarily comment out a block of code or add a lengthy comment.
```csharp
/*
 This is a multi-line comment
 spanning several lines
*/
```
- `XML comments` start with `///` and are used to document classes, properties, and methods. These comments can be parsed by the IDE to provide tooltips for your code, and can be exported to create an API reference document.
```csharp
/// <summary>
/// This method does something interesting.
/// </summary>
/// <param name="param1">The first parameter.</param>
/// <returns>Returns a string that represents something interesting.</returns>
public string DoSomethingInteresting(int param1)
{
    //...
}
```
### 2.3 TODO Comments
If there's a part of your code that you need to come back to (perhaps to fix a bug or add a feature), use a TODO comment. This helps you (and other developers) quickly find areas of the code that need attention.
```csharp
// TODO: Implement this feature
```
Most IDEs have a feature to list all TODO comments in a project, making it easy for you to find them later.

## 3. Error Handling

### 3.1 General
When writing your plugin, it's essential to anticipate and handle potential errors. This not only makes your plugin more robust but also helps server administrators troubleshoot issues when they arise.

### 3.2 Exception Handling
In C#, you can use try/catch blocks to handle exceptions, or unusual conditions that might arise while your code is running.
```csharp
try
{
    // Potentially risky code here...
}
catch (Exception ex)
{
    Puts($"An error occurred: {ex.Message}");
}
```
In this example, `Puts` is a method provided by the Oxide framework for logging messages to the console. It's a good idea to log any exceptions that occur, as this can help you or other developers debug the problem later.

### Input Validation
One common source of errors in plugins is user input. Always validate input before using it. For instance, if you're expecting a number, check if the input can be parsed as a number:
```csharp
public void MyCommand(ConsoleSystem.Arg arg)
{
    if (!int.TryParse(arg.Args[0], out var number))
    {
        SendReply(arg, "Please enter a valid number.");
        return;
    }

    // Proceed with the command...
}
```
In this example, `SendReply` is another method provided by Oxide. It allows your plugin to send a message back to the player who executed the command.

### 3.4 Null Checking

It's also important to check for `null` values before using objects, especially when working with API methods that might return `null`.
```csharp
BasePlayer player = BasePlayer.Find(arg.Args[0]);
if (player == null)
{
    SendReply(arg, "Player not found.");
    return;
}

// Proceed with the command...
```
In this example, if the player is not found, `BasePlayer.Find` returns `null`, and we send an error message back to the user.

## 4. Efficiency

### 4.1 General
When writing your plugins, consider how they might impact the server's performance. It's crucial to use resources efficiently and avoid unnecessary operations that could slow down the server.

### 4.2 Avoid Unnecessary Calculations
Try to avoid performing the same calculation multiple times, especially within loops. Use variables to store the results of expensive computations and reuse them when needed.
```csharp
var players = BasePlayer.activePlayerList;
var playerCount = players.Count;

for (int i = 0; i < playerCount; i++)
{
    // Process players[i]...
}
```
In this example, the count of active players is stored in `playerCount` variable, so the Count property isn't accessed in each iteration of the loop.

### 4.3 Caching Expensive Values
If your plugin frequently accesses a value that's expensive to compute or retrieve, consider caching it. This is particularly useful for data that doesn't change frequently.
```csharp
private Dictionary<string, BasePlayer> playerCache = new Dictionary<string, BasePlayer>();

public BasePlayer GetPlayer(string name)
{
    if (!playerCache.TryGetValue(name, out var player))
    {
        player = BasePlayer.Find(name);
        playerCache[name] = player;
    }

    return player;
}
```
In this example, `GetPlayer` method uses a dictionary to cache player instances. When requested, it first checks if the player is in the cache. If not, it retrieves the player and adds it to the cache.

### 4.4 Using Data Structures Effectively
Understanding and using the right data structures can greatly improve the efficiency of your plugin. For example, if you frequently need to check whether a set of players contains a specific player, a `HashSet<BasePlayer>` is more efficient than a `List<BasePlayer>`.
```csharp
private HashSet<BasePlayer> playersSet = new HashSet<BasePlayer>();

public void AddPlayer(BasePlayer player)
{
    playersSet.Add(player);
}

public bool HasPlayer(BasePlayer player)
{
    return playersSet.Contains(player);
}
```
In this example, `HashSet` is used to store a set of players. The `Contains` method is significantly faster on a `HashSet` than on a `List`.

## 5. Code Structure
Good code structure makes your plugin easier to understand, maintain, and extend.

### 5.1 Use Methods to Break Down Complex Tasks
Methods are a good way to organize your code and to break down complex tasks into smaller, manageable parts. A method should ideally perform a single task.

```csharp
private void BroadcastServerRestart(BasePlayer player)
{
    string message = "The server is restarting.";
    player.ChatMessage(message);
}
```
In this example, `BroadcastServerRestart` method handles the task of sending a server restart message to a player.

### 5.2 Use Classes and Interfaces for Encapsulation and Abstraction
Use classes to encapsulate related data and methods together. Consider creating new classes if you have methods that operate on the same set of data.

```csharp
public class PlayerManager
{
    private HashSet<BasePlayer> playersSet = new HashSet<BasePlayer>();

    public void AddPlayer(BasePlayer player)
    {
        playersSet.Add(player);
    }

    public bool HasPlayer(BasePlayer player)
    {
        return playersSet.Contains(player);
    }
}
```
In this example, a `PlayerManager` class is used to manage the set of players. It encapsulates the data (`playersSet`) and the methods that operate on this data (`AddPlayer` and `HasPlayer`).

### 5.3 Keep Related Code Together
Code that is related should be located near each other. This makes it easier to understand the relationships between different parts of your plugin.
```csharp
public void Init()
{
    // Initialization code here...

    // Register the commands after initialization.
    AddCovalenceCommand("hello", "HelloCommand");
}

private void HelloCommand(IPlayer player, string command, string[] args)
{
    player.Message("Hello, world!");
}
```
In this example, the `Init` method and the `HelloCommand` method are close together because they are related - the command is registered in the `Init` method and handled in the `HelloCommand` method.

Regions can be very useful to group related code together, especially in large code files. In Rust plugins, it's common to use regions to separate different sections of your code, such as command handlers, hooks, and helper methods.
```csharp
#region Command Handlers

private void HandleHelloCommand(IPlayer player, string command, string[] args)
{
    player.Message("Hello, world!");
}

#endregion

#region Hooks

private void OnPlayerConnected(BasePlayer player)
{
    // Handle player connected...
}

private void OnPlayerDisconnected(BasePlayer player)
{
    // Handle player disconnected...
}

#endregion

#region Helper Methods

private void BroadcastServerRestart(BasePlayer player)
{
    string message = "The server is restarting.";
    player.ChatMessage(message);
}

#endregion
```
In this example, the code is organized into three regions: Command Handlers, Hooks, and Helper Methods. This organization makes it easier to navigate through the code.

## 6. Versioning
Adopting a clear versioning system for your plugin is essential as it helps track changes over time and provides a reliable way for users to identify different versions of your plugin.

### 6.1 Semantic Versioning
Semantic Versioning (SemVer) is a common versioning scheme that is easy to understand and use. Semantic versioning strings have three parts: `MAJOR.MINOR.PATCH`, for example `1.0.0`.

- `MAJOR` version increment indicates that incompatible API changes were made.
- `MINOR` version increment indicates that new functionalities were added in a backward-compatible manner.
- `PATCH` version increment indicates that backward-compatible bug fixes were made.
Remember to update the version number in the `[Info]` attribute at the top of your plugin file every time you make a change to your plugin. Here's an example:
```csharp
[Info("ExamplePlugin", "AuthorName", "1.0.0")]
public class ExamplePlugin : RustPlugin
{
    // Your plugin code goes here...
}
```

### 6.2 Changelog
It's a good practice to maintain a changelog for your plugin. A changelog is a file that contains a curated, chronologically ordered list of notable changes for each version of a project. It allows users to see what changes were made in each version.

It is typically placed in the root directory of your project as `CHANGELOG.md` and follows a structure similar to:
```md
# Changelog

## [1.0.1] - 2023-06-20

### Added

- Added new feature XYZ.

### Fixed

- Fixed bug related to feature ABC.

## [1.0.0] - 2023-06-19

- Initial release.
```

Remember, each entry in your changelog should document any changes to the functionality of your plugin, such as bug fixes, new features, or changes to existing features.

## 7. Documentation
Documentation is a critical part of any software development project, including Oxide plugins. Clear, comprehensive documentation helps other developers understand your code and users use your plugin effectively. Here are some guidelines to keep in mind when documenting your Rust plugin:

### 7.1 Plugin Description
Start by documenting the plugin's basic information using the `Description` attribute, such as its purpose, basic functionality, and any important usage notes. For example:
```csharp
[Info("ExamplePlugin", "AuthorName", "1.0.0")]
[Description("This plugin allows players to do XYZ. Use /command to activate.")]
public class ExamplePlugin : RustPlugin
{
    // Your plugin code goes here...
}
```

### 7.2 README file
Every plugin should have a README file that provides an overview of the plugin, its features, how to install and use it, and any dependencies or prerequisites it requires.

Here's an example of what a basic README might look like:
```md
# ExamplePlugin for Rust

This plugin allows players to do XYZ in Rust.

## Features

- Feature 1
- Feature 2

## Installation

1. Download the .cs file and place it in your Oxide plugins folder.
2. Restart your Rust server.
3. The plugin will compile and load automatically.

## Usage

Use `/command` in the in-game chat to do XYZ.

## Dependencies

This plugin requires Oxide.Rust to work properly.
```

### 7.3 Code Comments
Wherever your code is complex or might not be immediately understandable to other developers, include comments explaining what the code is doing.

For example:
```csharp
// Checking if the player has permission to use the command
if (!player.HasPermission("exampleplugin.use")) 
{
    // Send a message to the player if they do not have permission
    SendReply(player, "You do not have permission to use this command.");
    return;
}
```

### 7.4 API Documentation
If your plugin provides an API for other plugins to use, make sure to document that API thoroughly. Include explanations of what each method and property does, what arguments it accepts (if any), and what it returns (if anything).

## 8. Respectfulness
While developing plugins, it's important to keep in mind that your software will be running on other people's servers, impacting their resources, performance, and the overall player experience. Therefore, you should follow a set of best practices to ensure that your plugin behaves respectfully. Here are some guidelines:

### 8.1 Avoid Malicious Code
Never include any code that could harm the server or players, invade their privacy, or go against the game's terms of service. This includes, but is not limited to, backdoors, spyware, intentional memory leaks, and data miners.

### 8.2 Minimize Console and Chat Spam
Only send necessary messages to the console or chat to avoid overwhelming users with information. When you need to convey a message to the user, consider using appropriate logging levels (`Puts`, `PrintWarning`, `PrintError`) based on the importance and urgency of the message.
```csharp
// Good practice
if(somethingWentWrong)
{
    PrintWarning("Something went wrong when executing this command");
}
```

### 8.3 Respect Server Performance
Avoid creating unnecessary load on the server. This includes:

- Minimizing expensive operations like heavy computations or file I/O.
- Avoiding blocking operations or running long tasks on the main game thread. Use async programming techniques if possible.
- Keeping your code optimized and efficient.

### 8.4 Stay Updated with Oxide Updates
Oxide Mod and game updates can often cause plugins to break. Keeping your plugin updated ensures your users don't experience unexpected downtime. If you're aware of an update that may take some time to adjust to, communicate this to your users to manage expectations.

You've now walked through the key guidelines for developing Rust plugins using the Oxide Mod framework. These guidelines cover important areas including naming conventions, commenting, error handling, efficiency, code structure, versioning, documentation, and respectfulness in coding practices.

Writing plugins is not just about making something functional; it also involves creating code that's clean, efficient, easy to read, and respectful of the game environment. By adhering to these guidelines, you will produce plugins that are robust, maintainable, and provide a positive experience for both server admins and players.

Don't forget to also check out our "Best Practices" section of the documentation for further insights on writing excellent plugins.

Congratulations on reaching the end of this guide! You're now ready to develop your own Rust plugins with the Oxide Mod framework in an effective and respectful manner. Happy coding!