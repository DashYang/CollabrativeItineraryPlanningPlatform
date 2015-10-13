package cn.edu.fudan.mybaits;

import java.util.List;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Select;


/**
 * @author dash
 * @category 
 * @version date 2014-12-2
 */
public interface IssueDAO {
	@Insert("insert into issues (`username`,`content`,`date`)"
			+ " values (#{username},#{content},#{date})")
	public int insert(Issue issue);
	
	@Select("select * from issues")
	public List<Issue> getList();
}
