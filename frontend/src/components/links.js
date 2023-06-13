export default function Links(props) {

    return(
        <ul id={props.id}>
            <li><a id="link" href="/link">Link</a></li>
            <li><a id="link2" href="/link2">Link2</a></li>
            <li><a id="link3" href="/link3">Link3</a></li>
            { props.user ? (
                <li><a id="logout" onClick={props.logout}>Logout</a></li>
            ) : (
                <li><a id="login" onClick={props.login} href="/login">Login</a></li>
            )}
        </ul>
    );
}