import axios from "axios"

const DATA_URI = (process.env.NODE_ENV === 'production') ? process.env.REACT_APP_PRODUCTION_URI : process.env.REACT_APP_DEV_URI;

export async function getCourses(){
    try {

        const res = await axios.get(`${DATA_URI}/courses`,
            {
                params: {
                    _sort: "title"
                }
            })
        return res.data;
    } catch (error) {
        return error
    }}

    export async function getUser(user){
        try {
            
            const res = await axios.post(`${DATA_URI}/users/email`,
                {
                    ...user,
                })
            return res.data;
        } catch (error) {
            return {error: "User not found"}
        }}


export async function getCourse(id){
    try {

        const res = await axios.get(`${DATA_URI}/courses/${id}`,
            {
                params: {
                    _sort: "title"
                }
            })
        return res.data;
    } catch (error) {
        return error
    }}

    export async function getCourseNoCache(id){
        try {
    
            const res = await axios.get(`${DATA_URI}/courses/nocache/${id}`,
                {
                    headers: {
                        'cache-control': 'no-cache'
                      },
                    params: {
                        _sort: "title"
                    }
                })
                console.log("aixos get for discussion:",res.data)
            return res.data;
        } catch (error) {
            return error
        }}

export async function createCourse(courseProps){
    try{

        const res = await axios.post(`${DATA_URI}/courses`, courseProps)
        return res.data;
    } catch (error) {
        return error
    }
}
export async function getCoursesPaginated(page){

    const LIMIT = 2;
    const res = await axios.get(`${DATA_URI}/courses`,{
        params: {_page: page, _sort: "title", _limit: LIMIT, _: ""},
        headers: {
            'x-total-count': 'true',
            'nextpage': 'true',
            'previouspage': 'true',
        },
    })

        const totalCount = parseInt(res.headers["x-total-count"])
        const nextPage = res.headers["nextpage"] ? parseInt(res.headers["nextpage"]):null;
        const previousPage = res.headers["previouspage"] ? parseInt(res.headers["previouspage"]): null;
      
        return ({
            nextPage,
            previousPage,
            courses: res.data,
        })
}
