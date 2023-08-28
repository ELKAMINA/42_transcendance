import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { Grid } from "@mui/material";
import Typography from "@mui/material/Typography";

import { Match } from "../../../types/match";

interface Myprops {
    us: Match;
}

const MatchHistory = (props: Myprops) => {
    let dateStr = props.us.createdAt;
    let date = new Date(dateStr);

    let formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1)
        .toString()
        .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
    // console.log(formatedDate); // Outputs: 2023-07-27
    React.useEffect(() => {}, []);
    return (
        <Card
        sx={(theme)=> ({
            width: {
                xs: '80vw',
                sm: '80vw',
                md: '80vw',
                lg: '80vw',
            },
            height: {
                xs: '10vh',
                sm: '10vh',
                md: '10vh',
                lg: '10vh',
            },
            // overflowY: 'auto',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            // alignContent: 'space-evenly',
            margin: 2,
            borderRadius: "4%",
            })}
        >
            <CardContent
                   sx={(theme)=> ({
                    width: {
                        xs: '80vw',
                        sm: '80vw',
                        md: '80vw',
                        lg: '80vw',
                    },
                    height: {
                        xs: '10vh',
                        sm: '10vh',
                        md: '10vh',
                        lg: '10vh',
                    },
                    flex: 1,
                    display: "flex",
                    flexDirection: "row",
                    // backgroundColor: 'yellow',
                    justifyContent: 'space-evenly',
                    alignItems: 'center',
                    // justifyContent: 'center',

                })}
            >
                <Typography component="div"
                    sx={(theme)=> ({
                        fontSize: {
                            xs: 11,
                            sm: 15,
                            md: 20,
                            lg: 25,
                        },
                        maxWidth: '100px',  // Choose an appropriate max width based on your design
                        overflow: 'hidden',
                        whiteSpace: 'nowrap',
                        textOverflow: 'ellipsis',
                        m: 2,
                    })}
                    color="text.secondary"
                    gutterBottom
                >
                    {props.us.player1Id}
                </Typography>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: 'center',
                        width: "10vw",
                    }}
                >
                    <Typography component="div"
                        sx={(theme)=> ({
                            fontSize: {
                                xs: 12,
                                sm: 15,
                                md: 20,
                                lg: 30,
                            },
                            color: "#07457E",
                            // m: 2,
                            maxWidth: '100px',  // Choose an appropriate max width based on your design
                            overflow: 'hidden',
                            whiteSpace: 'nowrap',
                            textOverflow: 'ellipsis'
                        })}
                        color="text.secondary"
                        gutterBottom
                    >
                        {props.us.p1_score} - {props.us.p2_score}
                    </Typography>
                    <Typography component="div"
                        sx={(theme)=> ({
                            fontSize: {
                                xs: 6,
                                sm: 8,
                                md: 10,
                                lg: 12,
                            },
                            // m: 2,
                            color: "#07457E",
                            font: "italic",
                            maxWidth: '100px',  // Choose an appropriate max width based on your design
                            overflow: 'hidden',
                            whiteSpace: 'nowrap',
                            textOverflow: 'ellipsis'
                        })}
                        color="text.secondary"
                        gutterBottom
                    >
                        {formattedDate}
                        {/* {Date.parse(props.us.createdAt.toString())} */}
                    </Typography>
                </Box>
                <Typography component="div"
                    sx={(theme)=> ({
                        fontSize: {
                            xs: 11,
                            sm: 15,
                            md: 20,
                            lg: 25,
                        },
                        color: "00FFFF",
                        m: 2,
                        maxWidth: '100px',  // Choose an appropriate max width based on your design
                        overflow: 'hidden',
                        whiteSpace: 'nowrap',
                        textOverflow: 'ellipsis'
                    })}
                    color="text.secondary"
                    gutterBottom
                >
                    {props.us.player2Id}
                </Typography>
            </CardContent>
        </Card>
    );
};

export default MatchHistory;
