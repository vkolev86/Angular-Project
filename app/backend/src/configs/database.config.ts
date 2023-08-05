import {connect, ConnectOptions} from 'mongoose';

export const dbConnect = () => {
    connect('mongodb+srv://vasilsl:!ADmin!03@cluster0.eps4csp.mongodb.net/?retryWrites=true&w=majority', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    } as ConnectOptions).then(
        () => console.log("connect successfully"),
        (error) => console.log(error)
    )
}