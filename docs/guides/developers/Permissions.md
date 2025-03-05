---
title: Permissions
after: Attributes
---
# Permissions

Oxide offers a substantial API to control user access with permissions and groups
Basic usage

For a primer on how to use permissions as a server owner, please consult the Using the Oxide permissions system tutorial.

Most plugins can benefit from some permissions. Below is a basic example of how to register a permission and check if a player has that permission assigned to them.
```csharp
namespace Oxide.Plugins
{
    [Info("Epic Stuff", "Unknown Author", "0.1.0")]
    [Description("Makes epic stuff happen")]
    class EpicStuff : CovalencePlugin
    {
        private void Init()
        {
            permission.RegisterPermission("epicstuff.use", this);
        }

        private void OnUserConnected(IPlayer player)
        {
            if (player.HasPermission("epicstuff.use"))
            {
                // Player has permission, do special stuff for them
            }
        }
    }
}
```
# API
## Groups
Get all groups
```csharp
string[] groups = permission.GetGroups();
```
Check if group exists
```csharp
bool GroupExists = permission.GroupExists("GroupName");
```
Create a group
```csharp
bool GroupCreated = permission.CreateGroup("GroupName", "Group Title", 0);
```
Remove a group
```csharp
bool GroupRemoved = permission.RemoveGroup("GroupName");
```
Check if group has a permission
```csharp
bool GroupHasPermission = permission.GroupHasPermission("GroupName", "epicstuff.use");
```
Grant permission to a group
```csharp
permission.GrantGroupPermission("GroupName", "epicstuff.use", this);
```
Revoke permission from a group
```csharp
permission.RevokeGroupPermission("GroupName", "epicstuff.use");
```
Get the rank for a group
```csharp
int GroupRank = permission.GetGroupRank("GroupName");
```
Get the title for a group
```csharp
string GroupTitle = permission.GetGroupTitle("GroupName");
```
Get parent group for a group
```csharp
string GroupParent = permission.GetGroupParent("GroupName");
```
Get permissions for a group
```csharp
string[] permissions = permission.GetGroupPermissions("GroupName", false);
```
Migrate group
```csharp
permission.MigrateGroup("OldGroupName", "NewGroupName");
```
## Users
Get permissions granted to player
```csharp
string[] UserPermissions = permission.GetUserPermissions("playerID");
```
Check if player has a permission
```csharp
bool UserHasPermission = permission.UserHasPermission("playerID", "epicstuff.use");
```
Add player to a group
```csharp
permission.AddUserGroup("playerID", "GroupName");
```
Remove player from a group
```csharp
permission.RemoveUserGroup("playerID", "GroupName");
```
Check if player is in a group
```csharp
bool UserHasGroup = permission.UserHasGroup("playerID", "GroupName");
```
Grant permission to a player
```csharp
permission.GrantUserPermission("playerID", "epicstuff.use", this);
```
Revoke permission from a player
```csharp
permission.RevokeUserPermission("playerID", "epicstuff.use");
```
## Server
Get all registered permissions
```csharp
string[] permissions = permission.GetPermissions();
```
Check if a permission exists
```csharp
bool PermissionExists = permission.PermissionExists("epicstuff.use", this);
```
Register a permission
```csharp
permission.RegisterPermission("epicstuff.use", this);
```