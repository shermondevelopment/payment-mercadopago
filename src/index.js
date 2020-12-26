const express = require('express');
const MercadoPago = require('mercadopago');
const app = express();
const { v4: uuidv4 } = require('uuid');
const User = require('./models/users');

MercadoPago.configure({
    sandbox: true,
    access_token:'TEST-2500240343681877-112117-92415a6b3365dc88ac30048c7996f90f-269366342'
});

app.get('/user', async (req, res) => {
    await User.create({name:'victor', email:'victor804.gt@gmail.com'});
    return res.status(200).json({success: 'cadstrado'});
});

app.get('/', (req, res) => {
    res.send('Olá Mundo');
});

app.get('/pagar', async (req, res) => {
    // pagamentos 
    // id // codigo // pagados // status
    // 1 // 34092840289042 // pagador // idUsuario // não foi pago
    // 2 // 90459043959439 // pagado //  idUsuario // foi pago
var id = uuidv4();

   let dados = {
       items: [
           item = {
               id: id,
               title: 'Produto acesso',
               quantity:1,
               currency_id: 'BRL',
               unit_price: parseFloat(20)
           }
       ],
       payer: {
           email: 'victor804.gt@gmail.com'
       },
       external_reference:id
   }

   try {
        var pagamento = await MercadoPago.preferences.create(dados);
        return res.redirect(pagamento.body.init_point);
   }catch(err) {
       return res.send(err.message);
   }
   console.log(pagamento);
  
});

app.post('/noti', (req, res) => {
   const { id } = req.params;
   setTimeout(() => {
    var filtro = {  
        "order.id" : id
    }
    MercadoPago.payment.search({
        qs: filtro
    }).then(data=> {
        let pagamento = data.body.results[0];
        if(pagamento !== undefined) {
            console.log(pagamento);
        } else {
            console.log('pagamento invalido');
        }
    }).catch(err=> {
      console.log(err);
    })
   }, 2000);
   return res.status(200).send('ok');
});

app.listen(process.env.PORT || 3002, () => console.log('running app'));