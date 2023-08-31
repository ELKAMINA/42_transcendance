import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Checkbox from "@mui/material/Checkbox";
import Avatar from "@mui/material/Avatar";
import { UserModel } from "../types/users/userType";
import ResponsiveTimePicker from "./ResponsiveTimePicker";
import { Stack, Tooltip } from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import WatchLaterIcon from "@mui/icons-material/WatchLater";
import formatTimeToISO from "../utils/formatTimeToISO";
import { selectActualUser } from "../redux-features/friendship/friendshipSlice";
import { useAppSelector } from "../utils/redux-hooks";
import { ChannelModel } from "../types/chat/channelTypes";
import { selectDisplayedChannel } from "../redux-features/chat/channelsSlice";

export type UserWithTime = {
    login: string;
    ExpiryTime: string | null;
};

type UserListProps = {
    usersSet: UserModel[]; // a list of users amongs which you make your selection
    initialUsers: UserModel[]; // a lits of users initially selected
    setUpdatedUsers: (users: UserModel[]) => void; // a function to update the selected users
    setTimer?: boolean; // a boolean to specify if you want the user to be able to set a timer. Set on false by default.
    setUpdatedUsersWithTime?: (usersAndTime: UserWithTime[]) => void;
};

export default function UserList({
    usersSet,
    initialUsers,
    setUpdatedUsers,
    setTimer = false,
    setUpdatedUsersWithTime,
}: UserListProps) {
    const userIndexes: number[] = initialUsers.map((admin) =>
        usersSet.findIndex((user) => user.login === admin.login)
    );

    // const currentUser = useAppSelector(selectActualUser);
    // const selectedChannel: ChannelModel = useAppSelector(
        // selectDisplayedChannel
    // );
    // const [isAdmin, setisAdmin] = React.useState<boolean>(false);
    // const [isOwner, setisOwner] = React.useState<boolean>(false);
// 
    // React.useEffect(() => {
        // if (currentUser) { // if current user is admin
			// if (selectedChannel.ownedBy.login === currentUser.login) {
				// setisOwner(true);
			// }
            // if (selectedChannel.admins.some((admin) => admin.login === currentUser.login)) {
                // setisAdmin(true);
            // }
        // }
    // }, [currentUser, selectedChannel.admins]);

    const [checked, setChecked] = React.useState<number[]>(
        userIndexes.filter((index) => index !== -1)
    );
    const [timeChecked, setTimeChecked] = React.useState<number[]>([-1]);

    // get the checked users
    const handleToggle = (value: number) => () => {
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        setChecked(newChecked);
        const updatedUsers: UserModel[] = [
            ...newChecked.map((index) => usersSet[index]),
        ];
        setUpdatedUsers(updatedUsers);
    };

    // get users with 'set timer' checked
    const usersTimeChecked = React.useRef<UserModel[]>([]);
    const handleTimeToggle = (value: number) => () => {
        const currentIndex = timeChecked.indexOf(value);
        const newChecked = [...timeChecked];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        setTimeChecked(newChecked);
        usersTimeChecked.current = newChecked
            .map((index) => usersSet[index])
            .filter(Boolean);
    };

    // get the user and time associated
    const [usersTime, setUsersTime] = React.useState<UserWithTime[]>([]);
    function handleSelectedTime(user: UserModel, time: string) {
        const timeZone = "Europe/Paris";
        const formattedTime = formatTimeToISO(time, timeZone);

        // Check if the user already has an associated time in the usersTime array
        const existingUserIndex = usersTime.findIndex(
            (userTime) => userTime.login === user.login
        );
        // If the user is present in usersTime, update the associated time
        if (existingUserIndex !== -1) {
            setUsersTime((prevUsersTime) => {
                const updatedUsersTime = [...prevUsersTime];
                updatedUsersTime[existingUserIndex].ExpiryTime = formattedTime;
                return updatedUsersTime;
            });
        } else {
            // If the user is not present in usersTime, add a new entry
            setUsersTime((prevUsersTime) => [
                ...prevUsersTime,
                { login: user.login, ExpiryTime: formattedTime },
            ]);
        }
    }

    // Effect to remove user/time objects if user.login is not in usersTimeChecked
    React.useEffect(() => {
        setUsersTime((prevUsersTime) => {
            // Filter the usersTime array to keep only the matching user.login
            const filteredUsersTime = prevUsersTime.filter((userTime) =>
                usersTimeChecked.current.some(
                    (checkedUser) => checkedUser.login === userTime.login
                )
            );
            return filteredUsersTime;
        });
    }, [usersTimeChecked]);

    React.useEffect(() => {
        if (setUpdatedUsersWithTime) setUpdatedUsersWithTime(usersTime);
    }, [usersTime, setUpdatedUsersWithTime]);

    return (
        <List dense sx={{ width: "100%", bgcolor: "background.paper" }}>
            {usersSet.map((el, value) => {
                const labelId = `checkbox-list-secondary-label-${value}`;
                const isChecked = checked.indexOf(value) !== -1; // Check if the item is checked
                const isTimeChecked = timeChecked.indexOf(value) !== -1; // Check if the item is checked
                // if I am admin but not owner, I cannot ban, mute or kick other admins
				// let isDisabled = false;
                // if (isAdmin && !isOwner){
					// isDisabled = userIndexes.indexOf(value) !== -1; // Check if the index is in userIndexes
				// }

                return (
                    <ListItem
                        key={value}
                        secondaryAction={
                            <Stack direction="row" spacing={1}>
                                {isChecked && setTimer && (
                                    <Stack direction={"row"}>
                                        {isTimeChecked === true && (
                                            <ResponsiveTimePicker
                                                handleSelectedTime={(time) =>
                                                    handleSelectedTime(el, time)
                                                }
                                                label="muted until..."
                                            />
                                        )}
                                        <Tooltip title="set timer">
                                            <Checkbox
                                                // disabled={isDisabled} // Disable the Checkbox if the index is in userIndexes
                                                icon={<AccessTimeIcon />}
                                                checkedIcon={<WatchLaterIcon />}
                                                onChange={handleTimeToggle(
                                                    value
                                                )}
                                                checked={isTimeChecked}
                                                inputProps={{
                                                    "aria-labelledby":
                                                        "no timer",
                                                }}
                                                sx={{
                                                    color: "#FF5B35",
                                                    "&.Mui-checked": {
                                                        color: "#FF5B35",
                                                    },
                                                }}
                                            />
                                        </Tooltip>
                                    </Stack>
                                )}
                                <Checkbox
                                    // edge="start"
                                    // disabled={isDisabled} // Disable the Checkbox if the index is in userIndexes
                                    onChange={handleToggle(value)}
                                    checked={isChecked}
                                    inputProps={{ "aria-labelledby": labelId }}
                                />
                            </Stack>
                        }
                        disablePadding
                    >
                        <ListItemButton>
                            <ListItemAvatar>
                                <Avatar
                                    alt={`Avatar of ${el.login}`}
                                    src={el?.avatar}
                                />
                            </ListItemAvatar>
                            <ListItemText id={labelId} primary={el.login} />
                        </ListItemButton>
                    </ListItem>
                );
            })}
        </List>
    );
}
