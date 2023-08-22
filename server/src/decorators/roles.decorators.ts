/* The SetMetadata function is a utility provided by NestJS to attach custom metadata to route handlers or classes. This metadata can later be read using NestJS's Reflector utility. */
import { SetMetadata } from '@nestjs/common';

/* Here, we're defining and exporting a constant named ROLES_KEY with the string value 'roles'. This constant acts as a key to uniquely identify the custom metadata that we're attaching. By exporting it, other parts of the application can also use it, ensuring consistency. */
export const ROLES_KEY = 'roles';

/* this is a custom decorator */
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
// console.log(' ROles ', Roles);

/* The ...roles: 
	string[] syntax in the function arguments is a rest parameter. It allows us to pass any number of string arguments to the Roles function, which are then gathered into an array named roles. 
*/

/* The arrow function : 
	defines the behavior of the Roles decorator 
*/

/* Within the arrow function, we're calling the previously imported SetMetadata : function. The first argument to SetMetadata is the key under which we want to store our metadata, and the second argument is the actual metadata value. In this case, we're using ROLES_KEY (which equals 'roles') as the key and the array of role strings (roles) as the value.
 */

/* More explanations : 
	When you use @Roles('admin', 'user') on a route, it attaches a metadata with key 'roles' and value ['admin', 'user'] to that route.
*/

/* What is metadata in nestjs:
In the context of NestJS:
	Metadata: It's extra information you add to classes, methods, or properties. This information doesn't change how these parts function directly but can be used elsewhere to influence behavior.

	Example very clear : 
	Imagine you have a box (a route in NestJS), and you attach a note to it that says "Fragile" (metadata). The note doesn't change what's inside the box, but it tells anyone handling the box to be careful. In the same way, metadata in NestJS can tell certain parts of the framework how to handle or treat a piece of code.

*/
