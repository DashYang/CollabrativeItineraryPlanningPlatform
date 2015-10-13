package cn.edu.fudan.GoogleCalendar;

import java.io.IOException;
import java.io.InputStream;

/**
 * @author dash
 * @version 1.0 date 2015-7-15
 * @since JDK1.6
 */
public class test {
	 public static void main(String[] args) {
		InputStream in = test.class.getResourceAsStream("client_secrets.json");
		try {
			while(in.read() > 0) {
				String line = in.toString();
			}
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
}
