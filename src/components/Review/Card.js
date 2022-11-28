import NextLink from "next/link";
// mui
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";

const ReviewCard = ({item}) => {
    if (!item) return

    return (
        <Card>
            <NextLink href={`/review/${item._id}`} passHref>
                <CardActionArea>
                    <CardContent>
                        <Stack divider={<Divider/>} spacing={2}>
                            <Typography>
                                {item.title}
                            </Typography>
                            {item.text && (
                                <Typography color="text.secondary">
                                    {item.text}
                                </Typography>
                            )}
                            <Typography textAlign={"end"}>
                                {`${item.user.username} // ${item.cafe.title}`}
                            </Typography>
                        </Stack>
                    </CardContent>
                </CardActionArea>
            </NextLink>
        </Card>
    )
}

export default ReviewCard