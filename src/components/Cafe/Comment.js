import axios from "axios";
import {useState} from "react";
import {useSelector} from "react-redux";
// mui
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import Rating from "@mui/material/Rating";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
// icons
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

const CafeComment = ({cafeID, commentArray}) => {
    const [comments, setComments] = useState(commentArray)
    const [text, setText] = useState('')
    const [value, setValue] = useState(5)

    const user = useSelector(state => state.user)
    const userID = user.id

    const handleInput = (event) => setText(event.target.value)

    const handleChange = (_, newValue) => setValue(newValue)

    const handleSubmit = (event) => {
        event.preventDefault()

        if (!text.length) return alert('Текст комментария не указан')
        if (!value) return alert('Рейтинг не указан')

        axios
            .post('/api/comment/add', {text, rating: value, cafe: cafeID}, {withCredentials: true})
            .then(({data}) => {
                setComments([...comments, data.comment])
                setText('')
            });
    }

    const handleClick = (id) => {
        axios
            .post('/api/comment/remove', {id, cafe: cafeID}, {withCredentials: true})
            .then(_ => setComments(comments.filter(el => el._id !== id)));
    }

    const CommentList = () => {
        if (!comments || !comments.length) return <Typography> Комментариев пока нет </Typography>

        return (
            <List>
                {comments.map(({_id, user, text, rating}) => (
                    <ListItem key={_id} sx={{flexWrap: "wrap"}}>
                        <ListItemAvatar>
                            <Avatar alt={user.username} src={user.avatar}/>
                        </ListItemAvatar>
                        <ListItemText sx={{overflowWrap:"break-word"}} primary={user.username} secondary={text}/>
                        <ListItemIcon>
                            <Rating readOnly value={rating}/>
                        </ListItemIcon>
                        {userID === user._id && (
                            // todo fix icon after authorize
                            <ListItemIcon>
                                <IconButton onClick={() => handleClick(_id)}>
                                    <DeleteOutlineIcon/>
                                </IconButton>
                            </ListItemIcon>
                        )}
                    </ListItem>
                ))}
            </List>
        )
    }

    return (
        <Stack spacing={2}>
            <Typography variant={"h6"}> Комментарии </Typography>
            <CommentList/>
            {user.auth ? (
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={2} alignItems={"center"} justifyContent={"end"}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                value={text}
                                onInput={handleInput}
                                label={"Оставьте свой комментарий"}
                            />
                        </Grid>
                        <Grid item>
                            <Rating name="rating" value={value} onChange={handleChange}/>
                        </Grid>
                        <Grid item>
                            <Button
                                type="submit"
                                variant="outlined"
                                color={"secondary"}>
                                Отправить
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            ) : (
                <Typography>Авторизуйтесь, чтобы оставить комментарий</Typography>
            )}
        </Stack>
    )
}

export default CafeComment