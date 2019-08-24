package com.ads.xml.controller;

import java.util.ArrayList;
import java.util.List;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

import com.ads.xml.model.Employee;
import com.google.gson.Gson;

@Controller
@RestController
@RequestMapping("/upload")
public class UploadController {

	List<Employee> employeeList = new ArrayList<Employee> ();

	@GetMapping
	public ResponseEntity<String> getPost() {
		
		HttpHeaders responseHeaders = new HttpHeaders();
	    responseHeaders.set("Access-Control-Allow-Origin", "*");
		String json = new Gson().toJson(employeeList);
		
		return new ResponseEntity<String>(json, responseHeaders, HttpStatus.CREATED);
		}

	@PostMapping
	public ResponseEntity<String> singleFileUpload(@RequestParam("file") MultipartFile file, RedirectAttributes redirectAttributes) {
		
		if(!employeeList.isEmpty()) {
			
			employeeList.clear();
		}
			
		HttpHeaders responseHeaders = new HttpHeaders();
	    responseHeaders.set("Access-Control-Allow-Origin", "*");
	    
	    String type = file.getContentType();
	    
		if (file.isEmpty()) {

		    return new ResponseEntity<String>(new Gson().toJson(file.getOriginalFilename() + " is empty"), responseHeaders, HttpStatus.INTERNAL_SERVER_ERROR);


		}else if (!type.equals("text/xml")) {
			
			
		    return new ResponseEntity<String>(new Gson().toJson(file.getOriginalFilename() + " is not a valid XML file"), responseHeaders, HttpStatus.INTERNAL_SERVER_ERROR);

		}
		
		try {

			DocumentBuilderFactory dbFactory = DocumentBuilderFactory.newInstance();
			DocumentBuilder dBuilder = dbFactory.newDocumentBuilder();
			Document doc = dBuilder.parse(file.getInputStream());

			doc.getDocumentElement().normalize();

			System.out.println("Root element :" + doc.getDocumentElement().getNodeName());
					
			NodeList nList = doc.getElementsByTagName("employee");
						
			for (int temp = 0; temp < nList.getLength(); temp++) {

				Node nNode = nList.item(temp);
						
				if (nNode.getNodeType() == Node.ELEMENT_NODE) {

					Element eElement = (Element) nNode;
					
					String employyeId = eElement.getElementsByTagName("empoyeeid").item(0).getTextContent();
					String firstName = eElement.getElementsByTagName("firstname").item(0).getTextContent();
					String lastName = eElement.getElementsByTagName("lastname").item(0).getTextContent();
					String email = eElement.getElementsByTagName("email").item(0).getTextContent();
					String salary =  eElement.getElementsByTagName("salary").item(0).getTextContent();
					
					Employee employee = new Employee(employyeId, firstName, lastName, email, salary);
					
					employeeList.add(employee);
				}
			}
		    } catch (Exception e) {
		    	
			e.printStackTrace();
						
		    return new ResponseEntity<String>(new Gson().toJson(file.getOriginalFilename() + " is not properly formatted"), responseHeaders, HttpStatus.INTERNAL_SERVER_ERROR);

			
		    }

		
			for (Employee emp: employeeList) {
				
				System.out.println(emp);
			}			
			
			String json = new Gson().toJson(employeeList);
			
			    return new ResponseEntity<String>(json, responseHeaders, HttpStatus.CREATED);
	}


}
