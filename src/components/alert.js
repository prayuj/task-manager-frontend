import Alert from 'react-bootstrap/Alert'
import styled from 'styled-components'

const StyledDiv = styled.div`
    position: fixed;
    height: 100vh;
    width: 100vw;
    z-index: 1060;
    `

const StyledAlert = styled(Alert)`
    position: absolute;
    width: 100%;
    text-align: center;
`



const AlertComponent = ({ show, type, message }) => {

    if (show)
        return (
            <StyledDiv>
                <StyledAlert variant={type}>
                    {message}
                </StyledAlert>
            </StyledDiv>
        );
    return null;
}
export default AlertComponent;