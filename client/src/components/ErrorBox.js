import { Row, Col, Alert } from 'react-bootstrap';

function ErrorBox(props) {
   return (
      <Row className='mt-2 mx-2'>
         <Col>
            <Alert key='danger' variant='danger'>{props.message}</Alert>
         </Col>
      </Row>
   );
}

export {ErrorBox};