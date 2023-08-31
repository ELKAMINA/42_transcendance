import React, { useEffect } from "react";
import AlertDialogSlide from "./AlertDialogSlide";
import EnterPassword from "./EnterPassword";
import FullScreenAlert from "./FullScreenAlert";
import { Box } from "@mui/material";
import api from "../utils/Axios-config/Axios";
import { Channel } from "../types/chat/channelTypes";
import { useAppDispatch, useAppSelector } from "../utils/redux-hooks";
import { selectActualUser } from "../redux-features/friendship/friendshipSlice";
import { setIsMember } from "../redux-features/chat/channelsSlice";

type elementObj = {
    name: string;
    pbp: boolean;
};

type AskForPasswordProps = {
    AlertDialogSlideOpen: boolean;
    setAlertDialogSlideOpen: (isOpen: boolean) => void;
    getSelectedItem: (pwd: string) => void;
    element: Channel; // element with a key property
};

function AskForPassword({
    element,
    AlertDialogSlideOpen,
    setAlertDialogSlideOpen,
    getSelectedItem,
}: AskForPasswordProps) {
    // const [AlertDialogSlideOpen, setAlertDialogSlideOpen] = React.useState(false);
    const [alertError, setAlertError] = React.useState<boolean>(false);
    const [alertSuccess, setAlertSuccess] = React.useState<boolean>(false);
    const [isPasswordCorrect, setIsPasswordCorrect] =
        React.useState<boolean>(false);

    async function checkPassword(pwd: string) {
        if (element) {
            if (element.pbp) {
                try {
                    await api
                        .post("http://localhost:4001/channel/checkPwd", {
                            pwd: pwd,
                            obj: { name: element.name },
                        })
                        .then((response : any) => {
                            setIsPasswordCorrect(response.data);
                        })
                        .catch((error : any) =>
                            console.log(
                                "caught error while checking password")
                        );
                } catch (error) {
                    console.error(
                        "Error occurred while verifying password");
                }
            }
        }
    }

    function handlepwd(pwd: string) {
        checkPassword(pwd);
    }

	const currentUser = useAppSelector(selectActualUser);
	const appDispatch = useAppDispatch();

    // handle what happens when the passwordfield window closes
    const handleClose = () => {
        if (isPasswordCorrect === true) {
            setAlertSuccess(true);

			// if the user is a new member of the channel he just unlocked
			if (element && element.members && !element.members.some((member) => member.login === currentUser.login)) {
				appDispatch(setIsMember(true));
			}
			else {
				// fetch the channel to display it
				getSelectedItem(element.name);
			}

        } else {
            getSelectedItem("WelcomeChannel");
            setAlertError(true);
        }
        setIsPasswordCorrect(false);
        setAlertDialogSlideOpen(false);
    };

    const handleCloseAlert = () => {
        setAlertError(false);
        setAlertSuccess(false);
    };

    const uniquePasswordFieldId =
        "passwordfield_" + Math.random().toString(36).substring(7);

    return (
        <div>
            <AlertDialogSlide
                handleClose={handleClose}
                open={AlertDialogSlideOpen}
                dialogContent={
                    <EnterPassword
                        isOpen={AlertDialogSlideOpen}
                        handlepwd={handlepwd}
                        passwordFieldId={uniquePasswordFieldId}
                        isPwdCorrect={isPasswordCorrect}
                    />
                }
            />
            <Box>
                {alertError && (
                    <FullScreenAlert
                        severity="error"
                        alertTitle="Error"
                        normalTxt="incorrect password --"
                        strongTxt="you may not enter this channel."
                        open={alertError}
                        handleClose={handleCloseAlert}
                    />
                )}
                {alertSuccess && (
                    <FullScreenAlert
                        severity="success"
                        alertTitle="Success"
                        normalTxt="password is correct! --"
                        strongTxt="you may enter this channel."
                        open={alertSuccess}
                        handleClose={handleCloseAlert}
                    />
                )}
            </Box>
        </div>
    );
}

export default AskForPassword;
