package cn.edu.fudan.mybaits;

import java.io.IOException;
import java.io.Reader;

import org.apache.ibatis.io.Resources;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.ibatis.session.SqlSessionFactoryBuilder;

/**
 * @author dash
 * @category mybaits
 * @version date 2014-12-2
 */
public class DAOManager {
	/**
	 * userDAO
	 * 
	 * @return
	 */
	public static SqlSession getSession() {
		String resource = "applicationContext-myBatis.xml";
		Reader reader = null;
		SqlSession session = null;
		SqlSessionFactory factory;
		SqlSessionFactoryBuilder builder = new SqlSessionFactoryBuilder();
		try {
			reader = Resources.getResourceAsReader(resource);
		} catch (IOException e) {
			e.printStackTrace();
		}
		factory = builder.build(reader);
		session = factory.openSession();
		return session;
	}

}
