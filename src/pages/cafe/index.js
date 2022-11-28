import {useState} from "react";
import {useDispatch} from "react-redux";
// local
import nextAuth from "../../middlewares/nextAuth";
import {getCafeArray} from "../../middlewares/dbReq";
import {loginUser} from "../../utils/user/userSlice";
import Layout from "../../components/Layout";
import CafeCard from "../../components/Cafe/Card";
// mui
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";


const CafeMain = ({user, cafeArray}) => {
    const dispatch = useDispatch()
    if (user) dispatch(loginUser(user))

    const [cafe, setCafe] = useState(cafeArray.sort((a,b) => b.rating - a.rating));
    const [filter, setFilter] = useState(0)

    if (!cafeArray.length) {
        return (
            <Layout>
                <Typography variant={"h4"}>
                    Удобный поиск кафе с отзывами от критиков
                </Typography>
                <Grid container spacing={2}>
                    <Grid item>
                        <Paper>
                            <Typography sx={{p:2}}>Список пуст</Typography>
                        </Paper>
                    </Grid>
                </Grid>
            </Layout>
        )
    }

    const handleChange = (newValue) => {
        switch (newValue) {
            case 0:
                setCafe([...cafeArray].sort((a,b) => b.rating - a.rating))
                break;
            case 1:
                setCafe([...cafeArray].filter(cafe => user.favorite.includes(cafe._id)))
                break;
            case 2:
                setCafe([...cafeArray].sort((a,b) => a.cost - b.cost))
                break;
        }

        setFilter(newValue)
    }

    return (
        <Layout>
            <Typography variant={"h4"}>
                Список всех кафе
            </Typography>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Tabs value={filter}
                          onChange={(_, newValue) => handleChange(newValue)}>
                        <Tab label="По рейтингу"/>
                        <Tab label="Избранные" disabled={!user}/>
                        <Tab label="По цене"/>
                    </Tabs>
                </Grid>
                {cafe.map((cafe, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                        <CafeCard cafe={cafe}/>
                    </Grid>
                ))}
            </Grid>
        </Layout>
    )
}

export async function getServerSideProps({req}) {
    const user = await nextAuth(req)
    const cafeArray = await getCafeArray()

    return { props: {user, cafeArray} }
}

export default CafeMain