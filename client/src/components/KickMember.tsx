import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import { Socket } from "socket.io-client";
import { useTheme } from "@mui/material/styles";
import SendIcon from "@mui/icons-material/Send";
import DialogTitle from "@mui/material/DialogTitle";
import useMediaQuery from "@mui/material/useMediaQuery";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import UserList from "./UserList";

import api from "../utils/Axios-config/Axios";
import { useAppSelector } from "../utils/redux-hooks";
import { ChannelModel } from "../types/chat/channelTypes";
import { UserByLogin, UserModel } from "../types/users/userType";
import { selectDisplayedChannel } from "../redux-features/chat/channelsSlice";

/*** ISSUE 88 ***/
import { RootState } from "../app/store";
import { selectCurrentUser } from "../redux-features/auth/authSlice";

export type KickMemberProps = {
    socketRef: React.MutableRefObject<Socket | undefined>;
    openDialog: boolean;
    setOpenDialog: (arg0: boolean) => void;
};

export default function KickMember({
    socketRef,
    openDialog,
    setOpenDialog,
}: KickMemberProps) {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
    const selectedChannel: ChannelModel = useAppSelector((state) =>
        selectDisplayedChannel(state)
    );
    const [updatedKicked, setUpdatedKicked] = React.useState<UserModel[]>([]);
    /*** ISSUE 88 ***/
    // NEED THE currentUser TO CHECK IF THE USER WHO MUST BE KICKED IS THE currentUser
    const currentUser = useAppSelector((state: RootState) =>
        selectCurrentUser(state)
    );
    // const AppDispatch = useAppDispatch();


    function filterKickedMembersFromChannel() {
        const filteredMembers = selectedChannel.members
            .filter(
                (member) =>
                    !updatedKicked.some(
                        (kickedOutMember) =>
                            member.login === kickedOutMember.login
                    )
            )
            .map((member) => ({ login: member.login }));

        // console.log("filteredMembers = ", filteredMembers);
        KickMemberOut(filteredMembers);
    }

    React.useEffect(() => {
       console.log('updated Kick ', updatedKicked)
    }, [updatedKicked])

    async function KickMemberOut(updatedMember: UserByLogin[]) {
        // console.log("[Chat - KickMemberOut]", "currentUser: ", currentUser);

        await api
            .post("http://localhost:4001/channel/replaceMembers", {
                channelName: { name: selectedChannel.name },
                members: updatedMember,
                action: 'kick',
                tokickOrLeave: updatedKicked,
            })
            .then((response) => {
                updatedKicked.map((kickedMember) => {
                    let dto: any = {
                        sentBy: currentUser,
                        message: `${kickedMember.login} has been kicked out of the channel!`,
                        sentAt: new Date(),
                        senderSocketId: socketRef.current?.id,
                        incoming: true,
                        outgoing: false,
                        subtype: "infoMsg",
                        channel: selectedChannel.name,
                        channelById: selectedChannel.name,
                    };
                    const userName = kickedMember.login;
                    // emit user has been kick out message
                    socketRef.current?.emit("kickedMember", {dto, userName});
                });
            })
            .catch((error) =>
                console.log("error while kicking members : ", error)
            );
    }

    const handleClose = () => {
        filterKickedMembersFromChannel();
        setOpenDialog(false);
    };

    const handleCancel = () => {
        setOpenDialog(false);
    };

    React.useEffect(() => {});

    const membersOptions: UserModel[] = selectedChannel.members.filter(
        (member: UserModel) => {
            // Check if the member is not in the admins array
			let isAdmin = selectedChannel.admins.some(admin => admin.login === member.login);
			if (currentUser === selectedChannel.ownedById)
				isAdmin = false;

            // Check if the member's login is different from channel.ownedById
            const isOwnedBy = member.login === selectedChannel.ownedById;

            // Return true if the member is not an admin and their login is different from channel.ownedById
            return !isAdmin && !isOwnedBy;
        }
    );

    return (
        <div>
            <Dialog
                fullScreen={fullScreen}
                open={openDialog}
                onClose={handleCancel}
                aria-labelledby="kick-member-dialog"
                maxWidth="sm" // Set the maxWidth to "md" for medium width
            >
                <DialogTitle id="kick-member-dialog">
                    {"Kick a member out of the channel"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Kick someone out.
                        <br />
                        Kicking people out means revoking their membership.
                    </DialogContentText>
                    <UserList
                        usersSet={membersOptions}
                        initialUsers={[]}
                        setUpdatedUsers={setUpdatedKicked}
                    />
                </DialogContent>
                <DialogActions>
                    <Button
                        variant="contained"
                        size="medium"
                        endIcon={<SendIcon />}
                        onClick={handleClose}
                        autoFocus
                    >
                        SUBMIT
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
