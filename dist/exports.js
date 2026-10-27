/* Offline browser exports. No contract or credential data leaves this site. */
(function(root){
  let fontPromise;
  async function contractPdf(c,roomLabel,fontInput){
    const {PDFDocument,rgb}=PDFLib,pdf=await PDFDocument.create();pdf.registerFontkit(fontkit);
    const bytes=fontInput||await(fontPromise||(fontPromise=fetch('assets/fonts/beline-document.ttf').then(r=>{if(!r.ok)throw Error('PDF字体加载失败');return r.arrayBuffer()})));
    const font=await pdf.embedFont(bytes,{subset:false}),available=new Set(font.getCharacterSet()),missing=new Set();
    const clean=t=>Array.from(String(t??'')).map(ch=>{if(ch==='\n'||available.has(ch.codePointAt(0)))return ch;missing.add(ch);return available.has(0x25a1)?'□':'?'}).join('');
    pdf.setTitle('Beline Home Demo Contract '+c.id);pdf.setAuthor('Beline Home');pdf.setSubject('DEMO ONLY - not a formal signed contract');pdf.setCreationDate(new Date('2026-10-24T00:00:00Z'));pdf.setModificationDate(new Date('2026-10-24T00:00:00Z'));
    let page,y,number=0;
    function addPage(){page=pdf.addPage([595.28,841.89]);number++;page.drawRectangle({x:42,y:788,width:511,height:4,color:rgb(1,.318,0)});page.drawText('Beline Home | 必达公寓云',{x:44,y:810,size:13,font,color:rgb(.18,.18,.18)});page.drawText('演示合同 · 不作为正式签署文件',{x:44,y:36,size:9,font,color:rgb(.45,.45,.45)});page.drawText(String(number),{x:536,y:36,size:9,font});y=752}
    function line(text,size=11){const paragraphs=clean(text).split('\n');for(const p of paragraphs){let row='';for(const ch of p){if(font.widthOfTextAtSize(row+ch,size)>505){if(y<85)addPage();page.drawText(row,{x:44,y,size,font,color:rgb(.18,.18,.18)});y-=size*1.9;row=ch}else row+=ch}if(y<85)addPage();if(row)page.drawText(row,{x:44,y,size,font,color:rgb(.18,.18,.18)});y-=size*1.9}}
    addPage();line('租房合同流程演示',21);y-=10;line('非正式合同，不代表真实身份核验、签署或第三方存证。',10);y-=12;
    line('合同编号：'+c.id+'    版本：v'+c.version);line('房间：'+roomLabel);line('演示住户：'+c.name+'    联系方式：'+c.phone);line('租期：'+c.start+' 至 '+c.end);line('月租：¥'+(c.rent/100).toFixed(2)+'    押金：¥'+(c.deposit/100).toFixed(2));line('确认状态：'+(c.confirmedAt?'双方已确认（演示）':'预览 / 线下登记')); y-=16;line('演示条款',14);line(c.terms||'演示租约摘要');y-=20;line('住户确认时间：'+(c.signedAt||'线下登记 / 尚未线上签署'));line('公寓确认时间：'+(c.confirmedAt||'线下登记 / 尚未线上确认'));
    if(c.signature?.startsWith('data:image/png;base64,')){const image=await pdf.embedPng(c.signature);if(y<170)addPage();page.drawImage(image,{x:44,y:y-65,width:210,height:63});y-=86}else line('签名记录：'+(c.signature||'未记录线上签名'));
    if(c.history?.length){y-=14;line('历史版本记录',14);for(const h of c.history)line('v'+h.version+'：'+h.start+' 至 '+h.end)}
    const data=await pdf.save();return{bytes:data,missing:Array.from(missing)};
  }
  function qrData(credential){const qr=qrcode(0,'M');qr.addData('BELINE-DEMO:'+credential.id+':'+credential.code);qr.make();return qr.createDataURL(6,24)}
  function save(bytes,type,name){const url=URL.createObjectURL(new Blob([bytes],{type})),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),5000)}
  root.BelineExports={contractPdf,qrData,save};
})(typeof globalThis!=='undefined'?globalThis:this);
