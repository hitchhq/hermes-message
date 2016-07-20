const sinon = require('sinon');
const should = require('should');
const HermesMessage = require('../message');

describe('HermesMessage', () => {
  describe('#stop', () => {
    it('changes stopped attribute', () => {
      const message = new HermesMessage();

      message.stopped.should.be.exactly(false);
      message.stop();
      message.stopped.should.be.exactly(true);
    });
  });

  describe('#cancelDelivery', () => {
    it('changes cancel_delivery attribute', () => {
      const message = new HermesMessage();

      message.cancel_delivery.should.be.exactly(false);
      message.cancelDelivery();
      message.cancel_delivery.should.be.exactly(true);
    });
  });

  describe('#reply', () => {
    it('can be called without arguments', () => {
      const message = new HermesMessage();
      const spy_send = sinon.spy(message, 'send');
      const spy_stop = sinon.spy(message, 'stop');
      const previous_topic = message.topic;
      const previous_payload = message.payload;

      message.reply();

      should(message.topic).be.exactly(previous_topic);
      should(message.payload).be.exactly(previous_payload);
      spy_send.calledOnce.should.be.exactly(true);
      spy_stop.calledOnce.should.be.exactly(true);
    });

    it('accepts payload as unique argument', () => {
      const message = new HermesMessage();
      const spy_send = sinon.spy(message, 'send');
      const spy_stop = sinon.spy(message, 'stop');
      const previous_topic = message.topic;
      const new_payload = { hello: 'hello' };

      message.reply(new_payload);

      should(message.topic).be.exactly(previous_topic);
      message.payload.should.be.exactly(new_payload);
      spy_send.calledOnce.should.be.exactly(true);
      spy_stop.calledOnce.should.be.exactly(true);
    });

    it('accepts topic and payload as arguments', () => {
      const message = new HermesMessage();
      const spy_send = sinon.spy(message, 'send');
      const spy_stop = sinon.spy(message, 'stop');
      const new_topic = 'hello';
      const new_payload = { hello: 'hello' };

      message.reply(new_topic, new_payload);

      message.topic.should.be.exactly(new_topic);
      message.payload.should.be.exactly(new_payload);
      spy_send.calledOnce.should.be.exactly(true);
      spy_stop.calledOnce.should.be.exactly(true);
    });

    it('accepts topic and payload as arguments, but if topic is not a string it fails', () => {
      const message = new HermesMessage();
      const error_message = 'HermesMessage.reply(topic, payload): topic must be a string.';
      const console_mock = sinon.mock(console).expects('error');
      console_mock.once().withExactArgs(error_message);

      message.reply({ bad_topic: true }, { some_payload: true });

      console_mock.verify().should.be.exactly(true);
    });
  });

  describe('#send', () => {
    it('emits `send` event and its unique argument is the message', (done) => {
      const message = new HermesMessage();

      message.on('send', function (m) {
        arguments.length.should.be.exactly(1);
        m.should.be.exactly(message);
        done();
      });
      message.send();
    });
  });
});
