# Circle Menu

Defined in `index.ts` for now. 

## Gotchas

* The materials for the circle menu have a `depthWrite: false` parameter, so that there isn't z-fighting. renderOrder has to be set as a result, too.

See https://stackoverflow.com/a/59530848

* You can't change the points of a geometry after creating it, save by rebuilding the whole geometry. So when the pie menu changes, we discard the whole geometry and create a new one:

See https://stackoverflow.com/a/44751341