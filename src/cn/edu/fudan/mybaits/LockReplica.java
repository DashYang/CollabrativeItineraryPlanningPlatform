package cn.edu.fudan.mybaits;

import java.util.LinkedList;
import java.util.List;

import org.apache.ibatis.session.SqlSession;

/**
 * @author dash
 * @version 1.0 date 2015-10-28
 * @since JDK1.6
 */
public class LockReplica implements EntityOperation{
	private int id;
	private String  date;
	private String city;
	private String group;
	private String start;
	private String end;
	private String type;
	private String title;
	private String content;
	private long receiveTime;
	
	public LockReplica() {
		super();
		this.id = 0;
		this.date = "";
		this.city = "";
		this.group = "";
		this.start = "";
		this.end = "";
		this.type = "";
		this.title = "";
		this.content = "";
		this.receiveTime = 0;
	}
	
	public LockReplica(String date, String city, String group,
			String start, String end, String type, String title,
			String content, long receiveTime) {
		super();
		this.date = date;
		this.city = city;
		this.group = group;
		this.start = start;
		this.end = end;
		this.type = type;
		this.title = title;
		this.content = content;
		this.receiveTime = receiveTime;
	}
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public String getDate() {
		return date;
	}
	public void setDate(String date) {
		this.date = date;
	}
	public String getCity() {
		return city;
	}
	public void setCity(String city) {
		this.city = city;
	}
	public String getGroup() {
		return group;
	}
	public void setGroup(String group) {
		this.group = group;
	}
	public String getStart() {
		return start;
	}
	public void setStart(String start) {
		this.start = start;
	}
	public String getEnd() {
		return end;
	}
	public void setEnd(String end) {
		this.end = end;
	}
	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}
	public String getTitle() {
		return title;
	}
	public void setTitle(String title) {
		this.title = title;
	}
	public String getContent() {
		return content;
	}
	public void setContent(String content) {
		this.content = content;
	}
	public long getReceiveTime() {
		return receiveTime;
	}
	public void setReceiveTime(long receiveTime) {
		this.receiveTime = receiveTime;
	}

	@Override
	public int save() {
		int saveId = -1;
		try {
			SqlSession session = DAOManager.getSession();
			LockReplicaDAO lockReplicaDAO = session.getMapper(LockReplicaDAO.class);
			LockReplica lockReplica = (LockReplica) this;
			saveId = lockReplicaDAO.insert(lockReplica);
			saveId = lockReplica.getId();
			session.commit();
			session.close();
		} catch (Exception e) {
			saveId = 0;
			System.out.println(e.toString());
		}
		return saveId;
	}
	
	public void delete() {
		try {
			SqlSession session = DAOManager.getSession();
			LockReplicaDAO lockReplicaDAO = session.getMapper(LockReplicaDAO.class);
			LockReplica lockReplica = (LockReplica) this;
			lockReplicaDAO.delete(lockReplica);
			session.commit();
			session.close();
		} catch (Exception e) {
			System.out.println(e.toString());
		}
	}
	
	public static List<LockReplica> getItineraryByMapInfo(String date , String city , String group) {
		List<LockReplica> list = new LinkedList<LockReplica>();
		try {
			SqlSession session = DAOManager.getSession();
			LockReplicaDAO lockReplicaDAO = session.getMapper(LockReplicaDAO.class);
			list = lockReplicaDAO.getMessageByMapInfo(date, city, group);
			session.commit();
			session.close();
		} catch (Exception e) {
			System.out.println(e.toString());
		}
		return list;
	}
	
	public void update() {
		try {
			SqlSession session = DAOManager.getSession();
			LockReplicaDAO lockReplicaDAO = session.getMapper(LockReplicaDAO.class);
			LockReplica lockReplica = (LockReplica) this;
			lockReplicaDAO.update(lockReplica);
			session.commit();
			session.close();
		} catch (Exception e) {
			System.out.println(e.toString());
		}
	}
}
