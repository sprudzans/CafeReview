import axios from "axios";
import {useRouter} from "next/router";
import dynamic from "next/dynamic";
import {useState} from "react";
import {useForm} from "react-hook-form";
// mui
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Input from "@mui/material/Input";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import LinearProgress from "@mui/material/LinearProgress";
import Backdrop from "@mui/material/Backdrop";

const Editor = dynamic(
    () => import("../Editor"),
    {ssr: false}
)

const CafeRedactor = ({cafe = {}}) => {
    const [src, setSrc] = useState(cafe.image || '');
    const [editorInstance, setEditorInstance] = useState({});

    const router = useRouter();

    const handleInstance = (instance) => setEditorInstance(instance);

    const [open, setOpen] = useState(false);
    const handleClose = () => setOpen(false);

    const {register, handleSubmit} = useForm();
    const onSubmit = async (data) => {
        const savedData = await editorInstance.save();

        const body = {
            image: src,
            title: data.title,
            cost: data.cost,
            desc:  JSON.stringify(savedData)
        }

        if (cafe._id) body.id = cafe._id

        const url = cafe._id ? '/api/cafe/update' : '/api/cafe/create'

        axios
            .post( url, body, {withCredentials: true})
            .then(({data}) => {
                if (data.message) alert(data.message)
                else {
                    setOpen(true);
                    setTimeout(() => router.push('/cafe/' + data.cafe), 2000)
                }
            })
    }

    const previewImage = ({target}) => {
        if (target.files && target.files[0]) {
            const formData = new FormData()
            formData.append("image", target.files[0])

            axios
                .post(process.env.NEXT_PUBLIC_UPLOAD_LINK, formData, {headers: {'content-type': 'multipart/form-data'}})
                .then( ({data}) => setSrc(process.env.NEXT_PUBLIC_UPLOAD_LINK + data.file) )
        }
    }

    const handleDelete = () => {
        axios
            .post('/api/cafe/delete', {id: cafe._id}, {withCredentials: true})
            .then(_ => {
                setOpen(true);
                setTimeout(() => router.push('/'), 2000)
            })
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2} justifyContent={"space-between"}>
                <Grid item xs={12} md={8}>
                    <Stack spacing={2}>
                        <TextField
                            variant={"standard"}
                            defaultValue={cafe.title || ''}
                            label={"Название кафе"}
                            {...register("title")}/>
                        <TextField
                            label="Средний чек"
                            type="number"
                            defaultValue={cafe.cost || 1000}
                            variant={"standard"}
                            inputProps={{ inputMode: 'numeric', pattern: '[0-9]*', step: 100 }}
                            {...register("cost")}/>
                        <Box>
                            <Editor placeholder={`Расскажите о кафе`}
                                    onInitialize={handleInstance} defaultValue={cafe.desc ? JSON.parse(cafe.desc) : {}}/>
                        </Box>
                        <Stack direction="row" spacing={2} justifyContent={"end"}>
                            <Button type="button" onClick={handleDelete} variant="outlined" color="error">Удалить</Button>
                            <Button type="submit" variant="outlined">Сохранить</Button>
                        </Stack>
                    </Stack>
                </Grid>
                <Grid item xs={12} sm={8} md={4}>
                    <Stack spacing={2} alignItems={"start"}>
                        <Box sx={{position: "relative", maxWidth: "100%", height: 220}}>
                            {src && <img src={src} alt="main image of cafe"/>}
                        </Box>
                        <Button
                            variant="outlined"
                            component="label">
                            Выбрать главное изображение
                            <Input
                                type="file"
                                inputProps={{accept: "image/png, image/jpeg"}}
                                sx={{display: "none"}}
                                onInput={previewImage}
                                {...register("picture")}/>
                        </Button>
                    </Stack>
                </Grid>
            </Grid>
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={open}
                onClick={handleClose}
            >
                <Box>
                    <Alert severity="success">
                        <AlertTitle>Успешно!</AlertTitle>
                        Вы будете переведены на страницу кафе
                    </Alert>
                    <LinearProgress color="success" />
                </Box>
            </Backdrop>
        </form>
    )
}

export default CafeRedactor