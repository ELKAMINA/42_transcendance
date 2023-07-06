import { Box, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import PasswordField from "./PasswordField";
import {HandlePwdFunction} from "./PasswordField"

interface EnterPasswordProps {
	handlepwd : HandlePwdFunction,
	passwordFieldId: string;
}

function EnterPassword (props: EnterPasswordProps) {
	const {handlepwd, passwordFieldId} = props;

	return (
		<Box>
			<DialogTitle>{"Password required!"}</DialogTitle>
			<DialogContent>
          		<DialogContentText id="alert-dialog-slide-description">
					This channel is protected by a password.
				</DialogContentText>
				<PasswordField handlePwd={handlepwd} passwordFieldId={passwordFieldId}/>	
        	</DialogContent>
		</Box>
	)
}

export default EnterPassword;