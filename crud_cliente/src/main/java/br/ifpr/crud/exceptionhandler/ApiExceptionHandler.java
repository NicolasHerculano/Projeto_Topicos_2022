package br.ifpr.crud.exceptionhandler;

import java.time.OffsetDateTime;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;
import br.ifpr.crud.exception.ApiException;

@ControllerAdvice
public class ApiExceptionHandler extends ResponseEntityExceptionHandler{

	@ExceptionHandler(ApiException.class)
	public ResponseEntity<Object> handleApiException(ApiException ex,WebRequest request) {
		
		HttpStatus status = HttpStatus.BAD_REQUEST;
		
		MensagemException erro = new MensagemException();
		erro.setDataHora(OffsetDateTime.now());
		erro.setStatus(status.value());
		erro.setTitulo(ex.getMessage());
		
		return handleExceptionInternal(ex, erro, new HttpHeaders(), status, request);
	}
}
