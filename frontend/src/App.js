import React,{useEffect,useMemo,useState}from 'react';
import{Container,Row,Col,Card,Button,Form,InputGroup,Spinner,Toast,ToastContainer}from'react-bootstrap';
import'bootstrap/dist/css/bootstrap.min.css';

const isValidAmazon=u=>/^(https?:\/\/)?(www\.)?amazon\.[a-z.]+\/.*?\/dp\/[A-Z0-9]{10}/i.test(u.trim());
const bgStyle={minHeight:'100vh',background:'radial-gradient(1200px 600px at 10% 10%, rgba(13,202,240,.15), rgba(13,110,253,0) 60%),radial-gradient(1000px 500px at 90% 30%, rgba(25,135,84,.18), rgba(13,110,253,0) 60%),linear-gradient(135deg,#0f172a 0%,#0b1220 100%)'};
const glassStyle={background:'rgba(255,255,255,.06)',border:'1px solid rgba(255,255,255,.15)',boxShadow:'0 10px 35px rgba(0,0,0,.35)',backdropFilter:'blur(8px)'};

export default function App(){
  const[link,setLink]=useState(''),[loading,setLoading]=useState(false),[toast,setToast]=useState({show:false,msg:'',variant:'success'});
  const isValid=useMemo(()=>link?isValidAmazon(link):true,[link]);
  const show=(msg,variant='success')=>{setToast({show:true,msg,variant});setTimeout(()=>setToast({show:false,msg:'',variant:'success'}),2800)};
  const predict=async()=>{
    const url=link.trim(); if(!url)return show('Please paste a product link.','danger');
    if(!isValidAmazon(url))return show('Only valid Amazon /dp/ASIN links are allowed.','danger');
    setLoading(true);
    try{
      const res=await fetch('http://localhost:5000/predict',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({url})});
      if(res.status===404)return show('No reviews found for this product.','warning');
      if(!res.ok)return show('Processing failed. Please try again.','danger');
      const b=await res.blob(); const a=document.createElement('a'); a.href=URL.createObjectURL(b); a.download='predicted_reviews.xlsx'; document.body.appendChild(a); a.click(); a.remove();
      show('Review report downloaded.','success');
    }catch(e){console.error(e);show('Error contacting the server.','danger')}
    finally{setLoading(false)}
  };
  useEffect(()=>{document.title='FauxSifter – Amazon Review Detector'},[]);
  return(
    <div style={bgStyle} className="text-light d-flex align-items-center">
      <Container className="py-5">
        <Row className="justify-content-center mb-4 text-center">
          <Col lg={10} xl={8}>
            <h1 className="display-5 fw-bold mt-3"><span className="text-warning">FauxSifter</span><span className="text-info"> – Amazon Review Detector</span></h1>
            <p className="lead text-white mb-0">Paste an Amazon product link and generate a polished Excel report labeling reviews as <span className="text-success fw-bold">REAL</span> or <span className="text-danger fw-bold">FAKE</span>.</p>
          </Col>
        </Row>
        <Row className="g-4">
          <Col md={7}>
            <Card style={glassStyle} className="rounded-4 p-2">
              <Card.Body className="p-4">
                <div className="d-flex align-items-center mb-3"><div className="text-success fw-bold me-2 fs-5">Start</div><h2 className="h5 mb-0 text-info">Prediction</h2></div>
                <Form.Label htmlFor="link" className="text-warning">Amazon Product Link (must contain <code>/dp/ASIN</code>)</Form.Label>
                <InputGroup className="mt-1">
                  <InputGroup.Text className={link&&!isValid?'border-danger text-danger':''}>🔗</InputGroup.Text>
                  <Form.Control id="link" type="text" value={link} onChange={e=>setLink(e.target.value)} placeholder="https://www.amazon.in/.../dp/ABCDEFGHIJ" className={`py-3 ${link&&!isValid?'is-invalid':''}`}/>
                  <Button variant="info" className="fw-bold" onClick={predict} disabled={loading}>{loading&&<Spinner as="span" animation="border" size="sm" className="me-2"/>}{loading?'Please wait…':'Start Prediction'}</Button>
                  <Form.Control.Feedback type="invalid">Please enter a valid Amazon link that contains /dp/ASIN.</Form.Control.Feedback>
                </InputGroup>
                <div className="mt-3 small text-info"><span>✅ Works with public Amazon product pages</span></div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={5}>
            <Card style={glassStyle} className="rounded-4 h-100">
              <Card.Body className="p-4">
                <h3 className="h5 fw-bold text-info mb-4">How it works</h3>
                <ol className="mb-0 ps-3 text-warning">
                  <li className="mb-3 fs-6">Paste an Amazon link containing <code>/dp/ASIN</code>.</li>
                  <li className="mb-3 fs-6">Server scrapes and classifies reviews (<span className="text-success fw-bold">REAL</span>/<span className="text-danger fw-bold">FAKE</span>).</li>
                  <li className="mb-1 fs-6">Excel download starts automatically.</li>
                </ol>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
      <ToastContainer position="bottom-center">
        <Toast show={toast.show} bg={toast.variant} onClose={()=>setToast({show:false})} delay={2800} autohide>
          <Toast.Body className={`text-center fw-semibold ${toast.variant==='warning'?'text-dark':'text-white'}`}>{toast.msg}</Toast.Body>
        </Toast>
      </ToastContainer>
    </div>
  );
}
