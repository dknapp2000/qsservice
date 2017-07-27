'use strict';

const express = require( "express" );
const qr = require( "qr-image" );
const parser = require( "body-parser" );
const fs = require( "fs" );
const path = require( "path" );
const morgan = require( "morgan" );

const port = 3001;

const respTemplate = fs.readFileSync( "response.html", "utf8" );
//console.log( respTemplate );

const app = express();

app.use(parser.urlencoded({ extended: false }));
app.use(morgan('tiny'))

app.get( "/", function( req, res ) {

    res.sendFile( path.join(__dirname, "index.html" ));
})

app.post( "/qrcode", function( req, res ) {
    
    const qrCode = qr.svgObject( req.body.text, { size: 30 } );

    let resp = respTemplate.replace( /{path}/, qrCode.path );
    resp       = resp.replace( /{text}/, req.body.text );

    res.send( resp );
})

app.get( "/qrcode/svg/:shipment/:key", function( req, res ) {

    const shipment = req.params.shipment;
    const key = req.params.key;

    const qrCode = qr.svgObject( `Shipment=${shipment}, Key=${key}`, { size: 30 } );

    let resp = respTemplate.replace( /{path}/, qrCode.path );
    resp       = resp.replace( /{text}/, req.body.text );

    res.send( resp );
})

app.get( "/qrcode/png/:shipment/:key", function( req, res ) {

    const shipment = req.params.shipment;
    const key = req.params.key;

    const qrCode = qr.image( `Shipment=${shipment}, Key=${key}`, { size: 30 } ).pipe(res);

})

app.listen( port, function() {
    console.log( "Listening on " + port );
});
