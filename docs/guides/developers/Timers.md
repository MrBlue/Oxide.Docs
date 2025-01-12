---
title: Timers
after: my-first-plugin
---
# Timers

Timers generally execute functions after a set interval. Optionally continuous, repeating, and immediate timers are also available.

## Single timer
Executes a function once after the specified delay interval.
```csharp
Timer myTimer = timer.Once(1f, () =>
{
    Puts("Hello world!");
});
```
## Continuous timer

Executes a function at the specified delay interval (until the timer is manually destroyed or plugin is unloaded).
```csharp
Timer myTimer = timer.Every(3f, () =>
{
    Puts("Hello world!");
});
```
## Repeating timer

Executes a function a specific number of times at the specified delay interval. If the number of recurrences is not specified (0), then a repeating timer behaves identically to a continuous timer.
```csharp
Timer myTimer = timer.Repeat(5f, 0, () =>
{
    Puts("Hello world!");
});
```
## Immediate timer

Executes a function immediately (in the next frame).
```csharp
NextFrame(() =>
{
    Puts("Hello world!");
});
```
or
```csharp
NextTick(() =>
{
    Puts("Hello world!");
});
```
Note: both method call Interface.Oxide.NextTick(callback);
## Destroying timer

When a timer is no longer operating, it is marked as destroyed. Additionally timers may be destroyed manually if stored in a variable.
```csharp
Timer myTimer = timer.Every(3f, () =>
{
    Puts("Hello world!");
});
```
```csharp
myTimer.DestroyToPool();
if (myTimer?.Destroyed ?? true)
{
    Puts("Timer destroyed!");
}
```
or
```csharp
timer.Destroy(ref myTimer);
if (myTimer?.Destroyed ?? true)
{
    Puts("Timer destroyed!");
}
```
Note: can also use myTimer.Destroy();  but Destroy() does not put timer back in the pool vs the other two methods use pooling