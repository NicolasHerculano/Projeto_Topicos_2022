package br.ifpr.crud.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;

import br.ifpr.crud.exception.ApiException;
import br.ifpr.crud.exception.NegocioException;
import br.ifpr.crud.model.Cliente;
import br.ifpr.crud.repository.ClienteRepository;

@Component
public class ClienteService {
	
	@Autowired
	private ClienteRepository clienteRepository;
	
	public ResponseEntity<Cliente> inserir(Cliente cliente) {
		try {
			//Validar campos obrigatórios
			this.validaCamposObrigatorios(cliente);	
			
			//Validar o email duplicado
			this.validaEmailDuplicado(cliente.getEmail(),
					0);
		
			//Salvar
			cliente = clienteRepository.save(cliente);
			return new ResponseEntity<Cliente>(cliente, HttpStatus.CREATED); 
		} catch (Exception e) {
			if(e instanceof NegocioException)
				throw e;
			else
				throw new ApiException("Erro ao inserir o cliente.");
		}
	}
	
	public ResponseEntity<Cliente> atualizar(Integer id, 
											Cliente cliente) {
		if(! clienteRepository.existsById(id))
			return new ResponseEntity<Cliente>(HttpStatus.NOT_FOUND);
		
		try {
			//Validar campos obrigatórios
			this.validaCamposObrigatorios(cliente);
			
			//Validar o email duplicado
			this.validaEmailDuplicado(cliente.getEmail(),
					id);
			
			cliente.setId(id);
			clienteRepository.save(cliente);
			
			return new ResponseEntity<Cliente>(cliente, HttpStatus.OK);
		} catch (Exception e) {
			if(e instanceof NegocioException)
				throw e;
			else
				throw new ApiException("Erro ao atualizar o cliente.");
		}
		
	}
	
	private void validaCamposObrigatorios(Cliente cliente) 
				throws NegocioException {
		//Validar nome
		if(cliente.getNome() == null || 
				cliente.getNome().trim().equals(""))
			throw new NegocioException("Erro ao salvar o cliente." + 
					" Campo nome é obrigatório.");
		
		//Validar email
		if(cliente.getEmail() == null || 
				cliente.getEmail().trim().equals(""))
			throw new NegocioException("Erro ao salvar o cliente." + 
					" Campo e-mail é obrigatório.");
		
		//Validar telefone
		if(cliente.getTelefone() == null || 
				cliente.getTelefone().trim().equals(""))
			throw new NegocioException("Erro ao salvar o cliente." + 
					" Campo telefone é obrigatório.");
	}
	
	private void validaEmailDuplicado(String email, 
				Integer idCliente) throws NegocioException {
		
		Optional<Cliente> optCliente = 			
				clienteRepository.findByEmail(email);
		
		if(optCliente.isPresent() &&
				(! optCliente.get().getId().equals(idCliente)) )
			throw new NegocioException(
					"Erro ao salvar o cliente." + 
					" E-mail já utilizado por outro cliente!");
	}
	
}
