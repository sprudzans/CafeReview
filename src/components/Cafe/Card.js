import {useSelector} from "react-redux";
import NextLink from "next/link";
// mui
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import Rating from "@mui/material/Rating"
import Grid from "@mui/material/Grid";
// icons
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

const CafeCard = ({cafe}) => {
    const user = useSelector(state => state.user)
    const isLiked = user.favorite ? user.favorite.includes(cafe._id) : false

    return (
        <Card>
            <NextLink href={`/cafe/${cafe._id}`} passHref>
                <CardActionArea>
                    <CardHeader
                        title={cafe.title}
                        subheader={<Rating name="read-only" value={cafe.rating} size="small" readOnly precision={0.5}/>}/>
                    <CardMedia
                        component="img"
                        height="220"
                        image={cafe.image}
                        alt={cafe.title}/>
                    <CardContent>
                        <Grid container sx={{justifyContent: "space-between"}}>
                            <Grid item xs={4}>
                                {user.auth && (
                                    <Typography>
                                        {isLiked ? <FavoriteIcon/> : <FavoriteBorderIcon/>}
                                    </Typography>
                                )}
                            </Grid>
                            <Grid item xs={4}>
                                <Typography textAlign={"center"}>
                                    {`${'₽'.repeat(cafe.cost > 4000 ? 4 : Math.ceil(cafe.cost / 500))}`}
                                </Typography>
                            </Grid>
                            <Grid item xs={4}>
                                <Typography textAlign={"end"}>
                                    чек ~ {cafe.cost} руб
                                </Typography>
                            </Grid>
                        </Grid>
                    </CardContent>
                </CardActionArea>
            </NextLink>
        </Card>
    )
}

export default CafeCard