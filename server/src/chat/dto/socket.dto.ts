import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsObject, IsString, Validate, ValidateNested, ValidationArguments } from "class-validator";
import { Socket } from "socket.io";

// Custom validator function
function IsSocketObject(validationOptions?: ValidationArguments) {
	return function (object: Record<string, any>, propertyName: string) {
		const value = object[propertyName];
		if (!(value instanceof Socket)) {
			return [
				{
					property: propertyName,
					constraints: {
						isSocketObject: `The ${propertyName} must be a Socket object from socket.io.`,
					},
				},
			];
		}
	};
}

export class SocketDto {
	@IsObject()
	@Validate(IsSocketObject)
	@ApiProperty()
	socket: Socket
}