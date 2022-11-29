import dynamic from "next/dynamic";
import {useState} from "react";
import axios from "axios";
import {useRouter} from "next/router";
// mui
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Backdrop from "@mui/material/Backdrop";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import LinearProgress from "@mui/material/LinearProgress";

const Editor = dynamic(() => import("../Editor"), {ssr: false})

const ReviewRedactor = ({review = {}, cafe = {}}) => {
    const router = useRouter();

    const [title, setTitle] = useState(review.title || '');
    const handleInput = (event) => setTitle(event.target.value);

    const [editorInstance, setEditorInstance] = useState({})
    const handleInstance = (instance) => setEditorInstance(instance);

    const [open, setOpen] = useState(false);
    const handleClose = () => setOpen(false);

    const handleSubmit = async (event) => {
        event.preventDefault();

        const savedData = await editorInstance.save();
        const data = {}

        if (review._id) {
            data.id = review._id;
            data.update = {title, desc: JSON.stringify(savedData)}
        } else {
            data.cafe = cafe._id;
            data.title = title;
            data.desc = JSON.stringify(savedData);
        }

        const url = review._id ? '/api/review/update' : '/api/review/create'

        axios
            .post(url, data, {withCredentials: true})
            .then(({data}) => {
                if (data.message) alert(data.message)
                else {
                    setOpen(true);
                    setTimeout(() => router.push('/review/' + data.review), 2000)
                }
            })
    }


    const handleDelete = () => axios
        .post('/api/review/delete', {id: review._id}, {withCredentials: true})
        .then(({data}) => {
            if (data.message) alert(data.message)
            else {
                setOpen(true)
                setTimeout(() => router.push('/'), 2000)
            }
        })

    return (
        <form onSubmit={handleSubmit}>
            <Stack spacing={2}>
                <TextField label={"Название отзыва"} value={title}
                           variant="standard" onInput={handleInput}/>
                <Box>
                    <Editor placeholder={`Расскажите о кафе`}
                            onInitialize={handleInstance} defaultValue={review.desc && JSON.parse(review.desc) || ""}/>
                </Box>
                <Stack direction="row" spacing={2} justifyContent={"end"}>
                    <Button type="button" onClick={handleDelete} variant="outlined" color="error">
                        {review._id ? "Удалить" : "Отменить" }
                    </Button>
                    <Button type="submit" variant="outlined" color={"secondary"}>Сохранить</Button>
                </Stack>
            </Stack>

            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={open}
                onClick={handleClose}>
                <Box>
                    <Alert severity="success">
                        <AlertTitle>Успешно!</AlertTitle>
                        Вы будете переведены на страницу отзыва
                    </Alert>
                    <LinearProgress color="success" />
                </Box>
            </Backdrop>
        </form>
    )
}

export default ReviewRedactor